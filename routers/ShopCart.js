const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 添加商品到购物车
router.post('/add', async (req, res) => {
    try {
        const { user_id, course_id, quantity } = req.body;
        const insertSql = "INSERT INTO ShoppingCart (user_id, course_id, quantity) VALUES (?, ?, ?)";
        const { err } = await db.async.run(insertSql, [user_id, course_id, quantity]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "添加商品到购物车失败" });
        } else {
            res.status(200).json({ code: 200, msg: "添加商品到购物车成功" });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ code: 500, msg: "添加商品到购物车失败" });
    }
});

// 获取用户购物车列表
router.get('/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const { err, rows } = await db.async.all("SELECT * FROM ShoppingCart WHERE user_id = ?", [user_id]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "获取购物车列表失败" });
        } else {
            res.status(200).json({ code: 200, msg: "获取购物车列表成功", data: rows });
        }
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ code: 500, msg: "获取购物车列表失败" });
    }
});

// 更新购物车商品数量
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { quantity } = req.body;
        const updateSql = "UPDATE ShoppingCart SET quantity = ? WHERE id = ?";
        const { err } = await db.async.run(updateSql, [quantity, id]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "更新购物车商品数量失败" });
        } else {
            res.status(200).json({ code: 200, msg: "更新购物车商品数量成功" });
        }
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ code: 500, msg: "更新购物车商品数量失败" });
    }
});

// 从购物车移除商品
router.delete('/remove/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteSql = "DELETE FROM ShoppingCart WHERE id = ?";
        const { err } = await db.async.run(deleteSql, [id]);
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ code: 500, msg: "从购物车移除商品失败" });
        } else {
            res.status(200).json({ code: 200, msg: "从购物车移除商品成功" });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ code: 500, msg: "从购物车移除商品失败" });
    }
});

module.exports = router;
