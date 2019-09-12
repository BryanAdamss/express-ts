/**
 * @author GuangHui
 * @description 权限控制器
 */

import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'
import config from '../config/config'

class AuthController {
  /**
   * 登录
   *
   * @static
   * @memberof AuthController
   */
  static login = async (req: Request, res: Response) => {
    // 检查username,password
    let { username, password } = req.body
    if (!(username && password)) {
      res.status(400).send()
    }

    // 获取用户信息
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      // 无权限
      res.status(401).send()
    }

    // 检查密码是否匹配
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    // 设置jwt token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    // 返回token
    res.send(token)
  }

  /**
   * 修改密码
   *
   * @static
   * @memberof AuthController
   */
  static changePassword = async (req: Request, res: Response) => {
    // 获取userId
    const id = res.locals.jwtPayload.userId

    // 从body中获取参数
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    // 获取用户信息
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      res.status(401).send()
    }

    // 检查旧密码是否匹配
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send()
      return
    }

    // 验证model(密码长度)
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    // 加密密码并更新user
    user.hashPassword()
    userRepository.save(user)

    // 204代表响应报文中包含若干首部和一个状态行，但是没有实体的主体内容
    // 对于一些提交到服务器处理的数据，只需要返回是否成功的情况下，可以考虑用状态码204来作为返回信息，从而省略多余的数据传输。使用ajax时，当只需要知道响应成功或失败的情况，可以用204来代替200，减少多余的数据传输
    res.status(204).send()
  }
}
export default AuthController
