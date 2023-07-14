const express = require('express');
const router = express.Router();
const { db } = require('../db/DbUtils');

// 提交评价
router.post('/commit', async (req, res) => {
  try {
    const { course_id, user_id, rating, comment } = req.body;
    const query = `INSERT INTO reviews (course_id, user_id, rating, comment, created_at)
                   VALUES (?, ?, ?, ?, datetime('now'))`;
    const params = [course_id, user_id, rating, comment];
    const { err } = await db.async.run(query, params);
    if (err) {
      console.error('执行插入时发生错误:', err);
      res.status(500).json({ code: 500, msg: '提交评价失败' });
    } else {
      res.status(200).json({ code: 200, msg: '提交评价成功' });
    }
  } catch (error) {
    console.error('提交评价时发生错误:', error);
    res.status(500).json({ code: 500, msg: '提交评价失败' });
  }
});

// 更新评价
router.put('/update/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;
    const query = `UPDATE reviews
                   SET rating = ?, comment = ?
                   WHERE id = ?`;
    const params = [rating, comment, reviewId];
    const { err } = await db.async.run(query, params);
    if (err) {
      console.error('执行更新时发生错误:', err);
      res.status(500).json({ code: 500, msg: '更新评价失败' });
    } else {
      res.status(200).json({ code: 200, msg: '更新评价成功' });
    }
  } catch (error) {
    console.error('更新评价时发生错误:', error);
    res.status(500).json({ code: 500, msg: '更新评价失败' });
  }
});

// 删除评价
router.delete('/delete/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const query = `DELETE FROM reviews WHERE id = ?`;
    const { err } = await db.async.run(query, [reviewId]);
    if (err) {
      console.error('执行删除时发生错误:', err);
      res.status(500).json({ code: 500, msg: '删除评价失败' });
    } else {
      res.status(200).json({ code: 200, msg: '删除评价成功' });
    }
  } catch (error) {
    console.error('删除评价时发生错误:', error);
    res.status(500).json({ code: 500, msg: '删除评价失败' });
  }
});

// 获取课程评价
router.get('/courses/:courseId/reviews', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const query = `SELECT r.id, r.rating, r.comment, r.created_at, u.username, u.avatar
                   FROM reviews r
                   JOIN users u ON r.user_id = u.id
                   WHERE r.course_id = ?`;
    const { err, rows } = await db.async.all(query, [courseId]);
    if (err) {
      console.error('执行查询时发生错误:', err);
      res.status(500).json({ code: 500, msg: '获取课程评价失败' });
    } else {
      res.status(200).json({ code: 200, msg: '获取课程评价成功', data: rows });
    }
  } catch (error) {
    console.error('获取课程评价时发生错误:', error);
    res.status(500).json({ code: 500, msg: '获取课程评价失败' });
  }
});

module.exports = router;
