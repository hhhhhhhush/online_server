const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 获取所有分类
router.get('/categories', async (req, res) => {
  try {
    const { err, rows } = await db.async.all("SELECT * FROM `categories`");
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "获取分类列表失败" });
    } else {
      res.status(200).json({ code: 200, msg: "获取分类列表成功", data: rows });
    }
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ code: 500, msg: "获取分类列表失败" });
  }
});

// 获取单个分类
router.get('/category/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { err, rows } = await db.async.all("SELECT * FROM `categories` WHERE id = ?", [categoryId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "获取分类详情失败" });
    } else if (rows.length === 0) {
      res.status(404).json({ code: 404, msg: "分类不存在" });
    } else {
      res.status(200).json({ code: 200, msg: "获取分类详情成功", data: rows[0] });
    }
  } catch (error) {
    console.error('Error retrieving category:', error);
    res.status(500).json({ code: 500, msg: "获取分类详情失败" });
  }
});

// 创建分类
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    const insertSql = "INSERT INTO `categories` (name) VALUES (?)";
    const { err, rows } = await db.async.run(insertSql, [name]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "创建分类失败" });
    } else {
      const categoryId = await db.async.all("SELECT last_insert_rowid() as id");
      res.status(201).json({ code: 201, msg: "创建分类成功", data: { id: categoryId } });
    }
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ code: 500, msg: "创建分类失败" });
  }
});

// 更新分类
router.put('/update/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    const updateSql = "UPDATE `categories` SET name = ? WHERE id = ?";
    const { err } = await db.async.run(updateSql, [name, categoryId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "更新分类失败" });
    } else {
      res.status(200).json({ code: 200, msg: "更新分类成功" });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ code: 500, msg: "更新分类失败" });
  }
});

// 删除分类
router.delete('/delete/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deleteSql = "DELETE FROM `categories` WHERE id = ?";
    const { err } = await db.async.run(deleteSql, [categoryId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "删除分类失败" });
    } else {
      res.status(200).json({ code: 200, msg: "删除分类成功" });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ code: 500, msg: "删除分类失败" });
  }
});

module.exports = router;
