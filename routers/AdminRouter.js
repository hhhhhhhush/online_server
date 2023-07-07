const express = require('express');
const router = express.Router()
const { v4: uuidv4 } = require('uuid')  //百度node uuid 用来生成token
const { db } = require('../db/DbUtils')

router.post('/login', async (req, res) => {
    // 登录的时候要从前端接收账号和密码
    let { account, password } = req.body;
    let { err, rows } = await db.async.all("select * from `admin` where `account` = ? and `password` = ?", [account, password]);

    if (err == null && rows.length > 0) {
        // 生成token存储给loginToken
        let loginToken = uuidv4();
        let updateTokenSql = "update `admin` set `token` = ? where `id` = ?";
        // 更新sql数据
        await db.async.run(updateTokenSql, [loginToken, rows[0].id])
        // rows[0]就是查询结果中的第一条记录
        let adminInfo = rows[0];
        adminInfo.token = loginToken;
        adminInfo.password = "";

        res.send({
            code: 200,
            msg: "登录成功",
            // 通过uuid生成一个token传递给前端 因为id很容易被撞见
            data: adminInfo,
        })
    }
    else {
        res.send({
            code: 500,
            msg: "登录失败"
        })
    }

})

module.exports = router;

