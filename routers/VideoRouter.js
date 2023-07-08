const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 获取课程的所有视频
router.get('/course/:id/videos', async (req, res) => {
    try {
        const courseId = req.params.id;
        const { err, rows } = await db.async.all("SELECT * FROM `videos` WHERE course_id = ?", [courseId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取课程视频列表失败" });
        } else {
            res.status(200).json({ code: 200, msg: "获取课程视频列表成功", data: rows });
        }
    } catch (error) {
        console.error('Error retrieving course videos:', error);
        res.status(500).json({ code: 500, msg: "获取课程视频列表失败" });
    }
});

// 获取单个视频信息
router.get('/video/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const { err, rows } = await db.async.all("SELECT * FROM `videos` WHERE id = ?", [videoId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取视频详情失败" });
        } else if (rows.length === 0) {
            res.status(404).json({ code: 404, msg: "视频不存在" });
        } else {
            res.status(200).json({ code: 200, msg: "获取视频详情成功", data: rows[0] });
        }
    } catch (error) {
        console.error('Error retrieving video:', error);
        res.status(500).json({ code: 500, msg: "获取视频详情失败" });
    }
});

// 创建视频
router.post('/create', async (req, res) => {
    try {
        const { course_id, title, url } = req.body;
        const insertSql = "INSERT INTO `videos` (course_id, title, url) VALUES (?, ?, ?)";
        const { err, rows } = await db.async.run(insertSql, [course_id, title, url]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "创建视频失败" });
        } else {
            const videoId = await db.async.all("SELECT last_insert_rowid() as id");
            res.status(201).json({ code: 201, msg: "创建视频成功", data: { id: videoId } });
        }
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ code: 500, msg: "创建视频失败" });
    }
});

// 更新视频
router.put('/update/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const { title, url } = req.body;
        const updateSql = "UPDATE `videos` SET title = ?, url = ? WHERE id = ?";
        const { err } = await db.async.run(updateSql, [title, url, videoId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "更新视频失败" });
        } else {
            res.status(200).json({ code: 200, msg: "更新视频成功" });
        }
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ code: 500, msg: "更新视频失败" });
    }
});

// 删除视频
router.delete('/delete/:id', async (req, res) => {
    try {
        const videoId = req.params.id;
        const deleteSql = "DELETE FROM `videos` WHERE id = ?";
        const { err } = await db.async.run(deleteSql, [videoId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "删除视频失败" });
        } else {
            res.status(200).json({ code: 200, msg: "删除视频成功" });
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ code: 500, msg: "删除视频失败" });
    }
});

module.exports = router;
