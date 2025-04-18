import { Response } from 'express'
import Friend from '../models/Friend'
import { FriendModelType } from '../utils/types/friends.types'
import {
  SendFriendRequestType,
  UpdateFriendRequestType
} from '../utils/types/friends.types'

const sendFriendRequest = async (req: SendFriendRequestType, res: Response) => {
  const { userId } = req.body
  const currentUserid = req.userId

  if (!userId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  if (userId == currentUserid) {
    return res.status(400).json({
      message: 'Invalid Request: You can not send request to yourself'
    })
  }

  try {
    let existingRequest = (await Friend.findOne({
      $or: [
        { user_1: currentUserid, user_2: userId },
        { user_1: userId, user_2: currentUserid }
      ]
    })) as FriendModelType | null

    if (existingRequest) {
      return res.status(409).json({ message: 'Friend Request already exists' })
    }

    const friendRequest = new Friend({ user_1: currentUserid, user_2: userId })
    await friendRequest.save()
    return res.status(200).json({ message: 'Friend Request sent' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const approveFriendRequest = async (
  req: UpdateFriendRequestType,
  res: Response
) => {
  const { friendRequestId } = req.body
  const currentUserid = req.userId

  if (!friendRequestId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const updatedFriend = (await Friend.findOneAndUpdate(
      { _id: friendRequestId, user_2: currentUserid, status: 'pendoing' },
      { status: 'accepted' },
      { new: true }
    )) as FriendModelType | null

    if (!updatedFriend) {
      return res.status(404).json({ message: 'Friend Request not found' })
    }

    return res
      .status(200)
      .json({ message: 'Friend Request Accepted Successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

const rejectedFriendRequest = async (
  req: UpdateFriendRequestType,
  res: Response
) => {
  const { friendRequestId } = req.body
  const currentUserid = req.userId

  if (!friendRequestId) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const updatedFriend = (await Friend.findOneAndUpdate(
      { _id: friendRequestId, user_2: currentUserid, status: 'pending' },
      { status: 'rejected' },
      { new: true }
    )) as FriendModelType | null

    if (!updatedFriend) {
      return res.status(404).json({ message: 'Friend Request not found' })
    }

    return res
      .status(200)
      .json({ message: 'Friend Request Rejected Successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export default {
  sendFriendRequest,
  approveFriendRequest,
  rejectedFriendRequest
}
