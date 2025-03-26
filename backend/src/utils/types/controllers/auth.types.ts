import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

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
