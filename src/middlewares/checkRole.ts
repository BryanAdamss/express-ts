/**
 * @author GuangHui
 * @description 检查用户角色中间件
 */

import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../entity/User'

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 从上一个中间件(checkJwt)中获取userId
    const id = res.locals.jwtPayload.userId

    // 获取用户信息
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      res.status(401).send()
    }

    // 检查用户是否有相关权限
    if (roles.indexOf(user.role) > -1) next()
    else res.status(401).send()
  }
}
