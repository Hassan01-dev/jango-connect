import { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { UserModelType } from '../utils/types/users.types'
import {
  CreateUserType,
  LoginRequestType,
  AuthenticatedRequest
} from '../utils/types/users.types'

// Promise<Response<any, Record<string, any>> | any>
const createUser = async (req: CreateUserType, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    let user = (await User.findOne({ email })) as UserModelType | null
    if (user) {
      return res.status(409).json({ message: 'User already exists' })
    }

    user = new User({
      firstName,
      lastName,
      username,
      email,
      password
    } as UserModelType)
    login
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    const payload = { userId: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    return res.status(201).json({
      message: 'User created successfully',
      user: { uuid: user.id, firstName, lastName, username, email },
      token
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const login = async (req: LoginRequestType, res: Response) => {
  const { identifier, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const payload = { userId: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    })

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        uuid: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      }
    })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const currentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-__v -password')
    return res.status(200).json(user)
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export default { createUser, login, currentUser }
