import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'

/**
 * UserController
 *
 * @class UserController
 */
class UserController {
  /**
   * 获取所有用户
   *
   * @static
   * @memberof UserController
   */
  static listAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({
      select: ['id', 'username', 'role'] // 返回id、username、role列(不要直接返回带有password的记录)
    })

    res.send(users)
  }

  /**
   * 根据id查找用户
   *
   * @static
   * @memberof UserController
   */
  static getOneById = async (req: Request, res: Response) => {
    // 从路径参数中取id
    const id: string = req.params.id

    // 获取用户信息
    const userRepository = getRepository(User)
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ['id', 'username', 'role'] // 返回id、username、role列(不要直接返回带有password的记录)
      })
      res.send(user)
    } catch (error) {
      res.status(404).send('User not found')
    }
  }

  /**
   * 创建新用户
   *
   * @static
   * @memberof UserController
   */
  static newUser = async (req: Request, res: Response) => {
    // 从body中拿到参数
    let { username, password, role } = req.body
    let user = new User()
    user.username = username
    user.password = password
    user.role = role

    // 验证user
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    // 加密密码
    user.hashPassword()

    // 尝试保存，如果报错，说明username重复
    const userRepository = getRepository(User)
    try {
      await userRepository.save(user)
    } catch (e) {
      res.status(409).send('username already in use')
      return
    }

    //If all ok, send 201 response
    // 201(已创建)请求成功并且服务器创建了新的资源。
    res.status(201).send('User created')
  }

  /**
   * 编辑用户
   *
   * @static
   * @memberof UserController
   */
  static editUser = async (req: Request, res: Response) => {
    // 从路径参数中取id
    const id: string = req.params.id

    // 从body中取参数
    const { username, role } = req.body

    // 尝试查找用户
    const userRepository = getRepository(User)
    let user
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      // 未找到
      res.status(404).send('User not found')
      return
    }

    // 验证user
    if (username) user.username = username
    if (role) user.role = role

    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    // 尝试保存，如果报错，说明username重复
    try {
      await userRepository.save(user)
    } catch (e) {
      res.status(409).send('username already in use')
      return
    }

    // 204(无内容)服务器成功处理了请求，但没有返回任何内容
    res.status(204).send()
  }

  /**
   * 删除用户
   *
   * @static
   * @memberof UserController
   */
  static deleteUser = async (req: Request, res: Response) => {
    // 从路径参数中取id
    const id = req.params.id

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      res.status(404).send('User not found')
      return
    }

    // 删除用户
    userRepository.delete(id)

    // 204(无内容)服务器成功处理了请求，但没有返回任何内容
    res.status(204).send()
  }
}

export default UserController
