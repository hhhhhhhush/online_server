const express = require('express')
const router = express.Router()
const { db } = require('../db/DbUtils')

router.get('/images', async (req, res) => {
    try {
      const query = 'SELECT * FROM swipers';
      const { err, rows } = await db.async.all(query);
      if (err) {
        console.error('执行查询时发生错误:', err);
        res.status(500).json({ code: 500, msg: '获取图片失败' });
      } else {
        res.status(200).json({ code: 200, msg: '获取图片成功', data: rows });
      }
    } catch (error) {
      console.error('获取图片时发生错误:', error);
      res.status(500).json({ code: 500, msg: '获取图片失败' });
    }
  });


module.exports = router;