const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');


// 获取所有笔记列表接口
router.get('/noteslist', (req, res) => {
    db.all("SELECT * FROM notes", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("服务器内部错误!");
        } else {
            res.send(rows);
        }
    });
});

// 获取单篇笔记接口
router.get('/single/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, note) => {
        if (err) {
            console.error(err);
            res.status(500).send("服务器内部错误");
        } else if (!note) {
            // 如果没有找到对应的笔记
            res.status(404).send("未找到笔记");
        } else {
            res.send(note);
        }
    });
});


// 创建笔记接口
router.post('/create', (req, res) => {
    const { title, content, username, avatar } = req.body;

    db.run("INSERT INTO notes (title, content, username, avatar) VALUES (?, ?, ?, ?)", [title, content, username, avatar], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("服务器内部错误!");
        } else {
            res.send("笔记创建成功!");
        }
    });
});


// 更新笔记接口（仅允许当前用户更新自己的笔记内容）
router.put('/updatenote/:id', (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    db.run("UPDATE notes SET title = ?, content = ? WHERE id = ?", [title, content, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("服务器内部错误");
        } else {
            res.status(201).send("笔记更新成功");
        }
    });
});


// 删除笔记接口（仅允许当前用户删除自己的笔记内容）
router.delete('/deletenote/:id', (req, res) => {
    const id = req.params.id;
    const user = req.query.user; // 使用 req.query 来获取查询参数中的用户信息

    // 在数据库中查询指定id的笔记信息
    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, note) => {
        if (err) {
            console.error(err);
            res.status(500).send("服务器内部错误");
        } else if (!note) {
            // 如果没有找到对应的笔记
            res.send("未找到笔记");
        } else if (note.username !== user) {
            // 如果笔记的用户名和当前用户不匹配，说明当前用户无权限删除此笔记
            res.send("你没有权限删除此笔记");
        } else {
            // 笔记的用户名和当前用户匹配，允许删除笔记
            db.run("DELETE FROM notes WHERE id = ?", [id], (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("服务器内部错误");
                } else {
                    res.status(201).send("笔记删除成功");
                }
            });
        }
    });
});

module.exports = router;
