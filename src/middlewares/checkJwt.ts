/**
 * @author GuangHui
 * @description toekn 鉴权中间件
 */

import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from '../config/config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // 从head中获取jwt token
  const token = <string>req.headers['auth']

  let jwtPayload

  // 尝试验证token并获取数据
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret)
    res.locals.jwtPayload = jwtPayload
  } catch (error) {
    // 鉴权失败，返回401(unauthorized)
    res.status(401).send()
    return
  }

  // token有效期为1h
  // 为每个请求设置一个新token
  const { userId, username } = jwtPayload
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: '1h'
  })

  res.setHeader('token', newToken)

  next()
}
