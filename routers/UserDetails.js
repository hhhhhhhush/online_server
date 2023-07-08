const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 获取用户详细信息
router.get('/get/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { err, rows } = await db.async.all("SELECT * FROM user_details WHERE user_id = ?", [userId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "获取用户详细信息失败" });
    } else if (rows.length === 0) {
      res.status(404).json({ code: 404, msg: "用户详细信息不存在" });
    } else {
      res.status(200).json({ code: 200, msg: "获取用户详细信息成功", data: rows[0] });
    }
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ code: 500, msg: "获取用户详细信息失败" });
  }
});

// 创建用户详细信息
router.post('/create', async (req, res) => {
  try {
    const { email, phone, birthday, address, user_id } = req.body;
    const insertSql = "INSERT INTO user_details (email, phone, birthday, address, user_id) VALUES (?, ?, ?, ?, ?)";
    const { err, rows } = await db.async.run(insertSql, [email, phone, birthday, address, user_id]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "创建用户详细信息失败" });
    } else {
      const userDetailId = await db.async.all("SELECT last_insert_rowid() as id");
      res.status(201).json({ code: 201, msg: "创建用户详细信息成功", data: { id: userDetailId } });
    }
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({ code: 500, msg: "创建用户详细信息失败" });
  }
});

// 更新用户详细信息
router.put('/update/:id', async (req, res) => {
  try {
    const userDetailId = req.params.id;
    const { email, phone, birthday, address } = req.body;
    const updateSql = "UPDATE user_details SET email = ?, phone = ?, birthday = ?, address = ? WHERE id = ?";
    const { err } = await db.async.run(updateSql, [email, phone, birthday, address, userDetailId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "更新用户详细信息失败" });
    } else {
      res.status(200).json({ code: 200, msg: "更新用户详细信息成功" });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ code: 500, msg: "更新用户详细信息失败" });
  }
});

// 删除用户详细信息
router.delete('/delete/:id', async (req, res) => {
  try {
    const userDetailId = req.params.id;
    const deleteSql = "DELETE FROM user_details WHERE id = ?";
    const { err } = await db.async.run(deleteSql, [userDetailId]);
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ code: 500, msg: "删除用户详细信息失败" });
    } else {
      res.status(200).json({ code: 200, msg: "删除用户详细信息成功" });
    }
  } catch (error) {
    console.error('Error deleting user details:', error);
    res.status(500).json({ code: 500, msg: "删除用户详细信息失败" });
  }
});

module.exports = router;
