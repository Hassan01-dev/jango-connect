import { Request } from "express";
import { TypedRequestBody } from "./base.types"

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
