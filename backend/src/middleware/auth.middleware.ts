import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../utils/types/users.types'

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('X-AUTH-TOKEN')

    if (!token) {
      return res
        .status(401)
        .json({ msg: 'Missing X-AUTH-TOKEN, authorization denied' })
    }

    const secret_key = process.env.JWT_SECRET || ''
    const decodedData = jwt.verify(token, secret_key) as JwtPayload
    req.userId = decodedData.userId
    next()
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export default verifyToken
