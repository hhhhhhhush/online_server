const sqlite3 = require('sqlite3').verbose();
const path = require('path');

var db = new sqlite3.Database(path.join(__dirname, "online.sqlite3"))

// 给db对象添加了async属性来存储异步操作方法
db.async = {}
// promise封装all和run方法
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

module.exports = { db }




