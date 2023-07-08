const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 获取所有用户
router.get('/users', async (req, res) => {
    try {
        const { err, rows } = await db.async.all("SELECT * FROM users");
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取用户列表失败" });
        } else {
            res.status(200).json({ code: 200, msg: "获取用户列表成功", data: rows });
        }
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ code: 500, msg: "获取用户列表失败" });
    }
});

// 获取单个用户
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { err, rows } = await db.async.all("SELECT * FROM users WHERE id = ?", [userId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取用户详情失败" });
        } else if (rows.length === 0) {
            res.status(404).json({ code: 404, msg: "用户不存在" });
        } else {
            res.status(200).json({ code: 200, msg: "获取用户详情成功", data: rows[0] });
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ code: 500, msg: "获取用户详情失败" });
    }
});

// 创建用户
router.post('/create', async (req, res) => {
    try {
        const { username, avatar, signature } = req.body;
        const insertSql = "INSERT INTO users (username, avatar, signature) VALUES (?, ?, ?)";
        const { err, rows } = await db.async.run(insertSql, [username, avatar, signature]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "创建用户失败" });
        } else {
            const userId = await db.async.all("SELECT last_insert_rowid() as id");
            res.status(201).json({ code: 201, msg: "创建用户成功", data: { id: userId } });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ code: 500, msg: "创建用户失败" });
    }
});

// 更新用户
router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, avatar, signature } = req.body;
        const updateSql = "UPDATE users SET username = ?, avatar = ?, signature = ? WHERE id = ?";
        const { err } = await db.async.run(updateSql, [username, avatar, signature, userId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "更新用户失败" });
        } else {
            res.status(200).json({ code: 200, msg: "更新用户成功" });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ code: 500, msg: "更新用户失败" });
    }
});

// 删除用户
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deleteSql = "DELETE FROM users WHERE id = ?";
        const { err } = await db.async.run(deleteSql, [userId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "删除用户失败" });
        } else {
            res.status(200).json({ code: 200, msg: "删除用户成功" });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ code: 500, msg: "删除用户失败" });
    }
});

module.exports = router;
