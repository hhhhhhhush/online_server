const express = require('express');
const router = express.Router()
const { db } = require('../db/DbUtils')

router.post('/register', async (req, res) => {
    // 从前端接收账号和密码
    let { account, password } = req.body;

    // 检查账号是否已存在
    let { err, rows } = await db.async.all("SELECT * FROM `admin` WHERE `account` = ?", [account]);

    if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ code: 500, msg: "注册失败" });
    } else {
        if (rows.length > 0) {
            res.status(400).json({ code: 400, msg: "账号已存在" });
        } else {
            // 插入新账号和密码到数据库
            let insertSql = "INSERT INTO `admin` (account, password) VALUES (?, ?)";
            await db.async.run(insertSql, [account, password]);

            res.status(200).json({ code: 200, msg: "注册成功" });
        }
    }
});


module.exports = router;

