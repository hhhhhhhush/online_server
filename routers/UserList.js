const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 用户登录接口
router.post('/login', async (req, res) => {
    try {
        const { username, password, phone } = req.body;
        let query = "SELECT * FROM users WHERE (username = ? OR phone = ?) AND password = ? LIMIT 1";
        let params = [username, phone, password];

        const { err, rows } = await db.async.all(query, params);
        if (err) {
            console.error('Error executing query:', err);
            res.send({ code: 500, msg: "登录失败" });
        } else if (rows.length === 0) {
            res.send({ code: 404, msg: "账号不存在或密码错误" });
        } else {
            res.status(200).json({ code: 200, msg: "登录成功", data: rows[0] });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.send({ code: 500, msg: "登录失败" });
    }
});

// 用户注册接口
// 创建用户（注册）
router.post('/register', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // 检查手机号是否已存在
        const checkSql = "SELECT * FROM users WHERE phone = ?";
        const { err, rows } = await db.async.all(checkSql, [phone]);
        if (err) {
            res.send({ code: 500, msg: "创建用户失败" });
            return;
        }

        // 如果手机号已存在，则返回错误信息
        if (rows.length > 0) {
            res.send({ code: 400, msg: "手机号已被注册" });
            return;
        }

        // 手机号不存在，可以进行注册
        const username = "鱿鱼丝";
        const avatar = ""; // 可以设置默认头像路径
        const signature = "快乐的小鱿鱼一枚吖~";
        const gender = "保密";
        const createTime = new Date().toISOString();
        const updateTime = createTime;

        const insertSql = "INSERT INTO users (username, password, phone, avatar, signature, gender, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const { err: insertErr, rows: insertRows } = await db.async.run(insertSql, [username, password, phone, avatar, signature, gender, createTime, updateTime]);
        if (insertErr) {
            console.error('Error executing query:', insertErr);
            res.send({ code: 500, msg: "创建用户失败" });
        } else {
            const userId = await db.async.all("SELECT last_insert_rowid() as id");
            res.status(201).json({ code: 201, msg: "创建用户成功", data: { id: userId } });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.send({ code: 500, msg: "创建用户失败" });
    }
});


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
router.get('/user/:id', async (req, res) => {
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

// 更新用户
router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, oldPass, newPass, phone, gender, signature, email, create_time } = req.body;
        const updateFields = {};
        const updateTime = new Date().toISOString();

        if (username) updateFields.username = username;
        if (phone) updateFields.phone = phone;
        if (gender) updateFields.gender = gender;
        if (signature) updateFields.signature = signature;
        if (email) updateFields.email = email;
        if (create_time) updateFields.create_time = create_time;
        updateFields.update_time = updateTime;

        if (oldPass && newPass) {
            // 验证旧密码是否正确
            const query = "SELECT * FROM users WHERE id = ? AND password = ?";
            const params = [userId, oldPass];
            const { errUpdate, rows } = await db.async.all(query, params);
            if (errUpdate) {
                console.error('执行查询时发生错误:', errUpdate);
                res.send({ code: 500, msg: "更新用户失败" });
                return;
            } else if (rows.length === 0) {
                res.send({ code: 400, msg: "旧密码不正确" });
                return;
            }
            // 更新密码
            updateFields.password = newPass;
        }

        let updateSql = "UPDATE users SET";
        const updateValues = [];
        for (const field in updateFields) {
            updateSql += ` ${field} = ?,`;
            updateValues.push(updateFields[field]);
        }
        updateSql = updateSql.slice(0, -1); // 移除末尾的逗号
        updateSql += " WHERE id = ?";
        updateValues.push(userId);

        const { err } = await db.async.run(updateSql, updateValues);
        if (err) {
            console.error('执行查询时发生错误:', err);
            res.status(500).json({ code: 500, msg: "更新用户失败" });
        } else {
            res.status(200).json({ code: 200, msg: "更新用户成功" });
        }
    } catch (error) {
        console.error('更新用户时发生错误:', error);
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

// 更新用户头像接口
router.put('/update/avatar/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { avatarUrl } = req.body;
        const updateSql = "UPDATE users SET avatar = ? WHERE id = ?";
        console.log(userId, avatarUrl);
        const { err, rows } = await db.async.run(updateSql, [avatarUrl, userId]);
        console.log(rows); // 检查受影响的行数
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({
                code: 500, msg: "更新用户头像失败"
            });
        } else {
            res.status(200).json({ code: 200, msg: "更新用户头像成功", data: { affectedRows: rows } });
        }
    } catch (error) {
        console.error('Error updating user avatar:', error);
        res.status(500).json({ code: 500, msg: "更新用户头像失败" });
    }
});

module.exports = router;
