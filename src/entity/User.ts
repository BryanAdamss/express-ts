/**
 * @author GuangHui
 * @description User模型
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Length, IsNotEmpty } from 'class-validator'
import * as bcrypt from 'bcryptjs'

@Entity() // 声明实体
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn() // 自增主键
  id: number

  @Column()
  @Length(4, 20) // 限制长度
  username: string

  @Column()
  @Length(4, 100)
  password: string

  @Column()
  @IsNotEmpty() // 非空
  role: string

  @Column()
  @CreateDateColumn() // 创建日期
  createdAt: Date

  @Column()
  @UpdateDateColumn() // 更新日期
  updatedAt: Date

  hashPassword() {
    // 加密密码
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    // 检查密码
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }
}
