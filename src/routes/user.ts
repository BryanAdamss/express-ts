import { Router } from 'express'
import UserController from '../controllers/UserController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

// 获取所有用户
router.get('/', [checkJwt, checkRole(['ADMIN'])], UserController.listAll)

// 根据id查找用户
router.get(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.getOneById
)

// 创建新用户
router.post('/', [checkJwt, checkRole(['ADMIN'])], UserController.newUser)

// 编辑用户信息
router.patch(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.editUser
)

// 删除用户
router.delete(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['ADMIN'])],
  UserController.deleteUser
)

export default router
