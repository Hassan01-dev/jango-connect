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
      res
        .status(401)
        .json({ msg: 'Missing X-AUTH-TOKEN, authorization denied' })
      return
    }

    const secret_key = process.env.JWT_SECRET || ''
    const decodedData = jwt.verify(token, secret_key) as JwtPayload
    req.userId = decodedData.userId
    next()
  } catch (error) {
    next(error)
  }
}

export default verifyToken
