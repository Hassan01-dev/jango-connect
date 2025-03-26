import mongoose, { Document } from 'mongoose'
import { Request } from 'express'

type UserAttributes = {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  bio?: string
  profileImage?: string
  friends: mongoose.Types.ObjectId[]
}

export default interface UserModelType extends UserAttributes, Document {}

export type CreateUserType = Request<
  {},
  {},
  {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
  }
>

export type LoginRequestType = Request<
  {},
  {},
  {
    identifier: string
    password: string
  }
>
