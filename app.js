const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')

const app = express();
const port = 3000;
// // 使用内置的中间件来解析请求体
app.use(express.json())
// 开放跨域请求
app.use(cors());
// 使用multer中间件，将文件上传到临时目录中 允许任何文件上传
const upload = multer({ dest: './public/upload/temp' }) // 指定文件保存的目录
app.use(upload.any())
// 指定静态资源文件路径
app.use(express.static(path.join(__dirname, "public")))
// 注册路由
app.use('/test',require('./routers/TestRouter'))
app.use('/admin',require('./routers/AdminRouter'))
app.use('/admin',require('./routers/RegisterAdmin'))
app.use('/course',require('./routers/CourseList'))
app.use('/category',require('./routers/CategoryRouter'))
app.use('/video',require('./routers/VideoRouter'))
app.use('/user',require('./routers/UserList'))
app.use('/swiper',require('./routers/SwiperRouter'))

app.get('/',(req,res) => {
    res.send('hello, world')
})

app.listen(port,() => {
    console.log(`App listening at http://localhost:${port}/`)
})