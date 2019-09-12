import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as cors from 'cors'
import routes from './routes'

// 连接数据库并启动express
createConnection()
  .then(async connection => {
    // 创建express app
    const app = express()

    // 中间件
    app.use(cors()) // 跨域用
    app.use(helmet()) // 通过设置各种http头帮助我们保护应用程序
    app.use(bodyParser.json()) // body解析

    // 设置路由
    app.use('/', routes)

    // 监听端口
    app.listen(3000, () => {
      console.log('Server started on port 3000!')
    })
  })
  .catch(error => console.log(error))
