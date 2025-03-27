import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../utils/types/controllers/auth.controller.types'

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
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token', error: error.message })
  }
}

export default verifyToken
