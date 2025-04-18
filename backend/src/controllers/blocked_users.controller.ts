import { Request, Response } from 'express'
import Block from '../models/BlockedUser'

// Block a User
const blockUser = async (req: Request, res: Response) => {
  const { userId } = req // Extracted from JWT
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Unblock a User
const unblockUser = async (req: Request, res: Response) => {
  const { userId } = req
  const { blockedUserId } = req.body

  if (!blockedUserId) {
    return res.status(400).json({ message: 'User to unblock is required' })
  }

  try {
    await Block.findOneAndDelete({ blocker: userId, blocked: blockedUserId })
    return res.status(200).json({ message: 'User unblocked successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Get Blocked Users
const getBlockedUsers = async (req: Request, res: Response) => {
  const { userId } = req

  try {
    const blockedUsers = await Block.find({ blocker: userId }).populate(
      'blocked',
      'name email'
    )
    return res.status(200).json({ blockedUsers })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export { blockUser, unblockUser, getBlockedUsers }
