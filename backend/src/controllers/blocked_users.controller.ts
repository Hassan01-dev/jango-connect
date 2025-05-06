import { NextFunction, Request, Response } from 'express'
import Block from '../models/BlockedUser'

// Block a User
const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req
  const { blockedUserId } = req.body

  if (!blockedUserId) {
    res.status(400).json({ message: 'User to block is required' })
    return
  }

  try {
    const existingBlock = await Block.findOne({
      blocker: userId,
      blocked: blockedUserId
    })
    if (existingBlock) {
      res.status(400).json({ message: 'User is already blocked' })
      return
    }

    const block = new Block({ blocker: userId, blocked: blockedUserId })
    await block.save()
    res.status(200).json({ message: 'User blocked successfully' })
  } catch (error) {
    next(error)
  }
}

// Unblock a User
const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req
  const { blockedUserId } = req.body

  if (!blockedUserId) {
    res.status(400).json({ message: 'User to unblock is required' })
    return
  }

  try {
    await Block.findOneAndDelete({ blocker: userId, blocked: blockedUserId })
    res.status(200).json({ message: 'User unblocked successfully' })
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
    res.status(200).json({ blockedUsers })
  } catch (error) {
    next(error)
  }
}

export { blockUser, unblockUser, getBlockedUsers }
