import { Router, Request, Response } from 'express'
import auth from './auth'
import user from './user'

const routes = Router()

// 挂载中间件
routes.use('/auth', auth)
routes.use('/user', user)

export default routes
