const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 获取课程列表
router.get('/courselist', async (req, res) => {
    try {
        // 从数据库中获取课程列表
        const { err, rows } = await db.async.all("SELECT * FROM `courses`");
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取课程列表失败" });
        } else {
            res.status(200).json({ code: 200, msg: "获取课程列表成功", data: rows });
        }
    } catch (error) {
        console.error('Error retrieving course list:', error);
        res.status(500).json({ code: 500, msg: "获取课程列表失败" });
    }
});


// 搜索课程
router.get('/coursesearch', async (req, res) => {
    try {
        const { keyword } = req.query;
        let searchSql = "SELECT * FROM `courses`";
        let searchParams = [];
        
        if (keyword && keyword.trim() !== '') {
            searchSql += " WHERE title LIKE ? OR description LIKE ? OR instructor LIKE ?";
            const searchKeyword = `%${keyword}%`;
            searchParams = [searchKeyword, searchKeyword, searchKeyword];
        }
        
        const { err, rows } = await db.async.all(searchSql, searchParams);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "搜索课程失败" });
        } else {
            res.status(200).json({ code: 200, msg: "搜索课程成功", data: rows });
        }
    } catch (error) {
        console.error('Error searching course:', error);
        res.status(500).json({ code: 500, msg: "搜索课程失败" });
    }
});

// 获取单个课程
router.get('/courseone/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const { err, rows } = await db.async.all("SELECT * FROM `courses` WHERE id = ?", [courseId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取课程详情失败" });
        } else if (rows.length === 0) {
            res.status(404).json({ code: 404, msg: "课程不存在" });
        } else {
            res.status(200).json({ code: 200, msg: "获取课程详情成功", data: rows[0] });
        }
    } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).json({ code: 500, msg: "获取课程详情失败" });
    }
});

// 创建课程
router.post('/create', async (req, res) => {
    try {
        const { title, description, instructor, cover_image, price, duration, category_id } = req.body;
        const insertSql = "INSERT INTO `courses` (title, description, instructor, cover_image, price, duration, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const { err, rows } = await db.async.run(insertSql, [title, description, instructor, cover_image, price, duration, category_id]);
        if (err, rows) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "创建课程失败" });
        } else {
            const courseId = await db.async.all("SELECT last_insert_rowid() as id");
            res.status(201).json({ code: 201, msg: "创建课程成功", data: { id: courseId } });
        }
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ code: 500, msg: "创建课程失败" });
    }
});

// 更新课程
router.put('/update/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description, instructor, cover_image, price, duration, category_id } = req.body;
        const updateSql = "UPDATE `courses` SET title = ?, description = ?, instructor = ?, cover_image = ?, price = ?, duration = ?, category_id = ? WHERE id = ?";
        const { err } = await db.async.run(updateSql, [title, description, instructor, cover_image, price, duration, category_id, courseId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "更新课程失败" });
        } else {
            res.status(200).json({ code: 200, msg: "更新课程成功" });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ code: 500, msg: "更新课程失败catch" });
    }
});

// 删除课程
router.delete('/delete/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const deleteSql = "DELETE FROM `courses` WHERE id = ?";
        const { err } = await db.async.run(deleteSql, [courseId]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "删除课程失败" });
        } else {
            res.status(200).json({ code: 200, msg: "删除课程成功" });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ code: 500, msg: "删除课程失败" });
    }
});


module.exports = router;
