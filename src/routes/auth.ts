/**
 * @author GuangHui
 * @description 权限相关路由
 */

import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { checkJwt } from '../middlewares/checkJwt'

const router = Router()
// 登录路由
router.post('/login', AuthController.login)

// 修改密码路由
// 先验证token
router.post('/change-password', [checkJwt], AuthController.changePassword)

export default router
