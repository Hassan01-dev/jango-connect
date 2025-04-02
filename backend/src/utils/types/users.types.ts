import mongoose, { Document } from 'mongoose'
import { Request } from "express";
import { TypedRequestBody } from "./base.types"

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

export interface UserModelType extends UserAttributes, Document {}

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export type CreateUserType = TypedRequestBody<{
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
  }
>

export type LoginRequestType = TypedRequestBody<
  {
    identifier: string
    password: string
  }
>
