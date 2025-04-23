import { NextFunction, Request, Response } from 'express'
import Block from '../models/BlockedUser'

// Block a User
const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req
  const { blockedUserId } = req.body

  if (!blockedUserId) {
    return res.status(400).json({ message: 'User to block is required' })
  }

  try {
    const existingBlock = await Block.findOne({
      blocker: userId,
      blocked: blockedUserId
    })
    if (existingBlock) {
      return res.status(400).json({ message: 'User is already blocked' })
    }

    const block = new Block({ blocker: userId, blocked: blockedUserId })
    await block.save()
    return res.status(200).json({ message: 'User blocked successfully' })
  } catch (error) {
    next(error)
  }
}

// Unblock a User
const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req
  const { blockedUserId } = req.body

  if (!blockedUserId) {
    return res.status(400).json({ message: 'User to unblock is required' })
  }

  try {
    await Block.findOneAndDelete({ blocker: userId, blocked: blockedUserId })
    return res.status(200).json({ message: 'User unblocked successfully' })
  } catch (error) {
    next(error)
  }
}

// Get Blocked Users
const getBlockedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req

  try {
    const blockedUsers = await Block.find({ blocker: userId }).populate(
      'blocked',
      'name email'
    )
    return res.status(200).json({ blockedUsers })
  } catch (error) {
    next(error)
  }
}

export { blockUser, unblockUser, getBlockedUsers }
