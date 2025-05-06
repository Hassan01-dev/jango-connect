import { NextFunction, Response } from 'express'
import Friend from '../models/Friend'
import User from '../models/User'
import { FriendModelType } from '../utils/types/friends.types'
import { paginationRequestType } from '../utils/types/base.types'
import { UserModelType } from '../utils/types/users.types'
import {
  SendFriendRequestType,
  UpdateFriendRequestType
} from '../utils/types/friends.types'

const sendFriendRequest = async (
  req: SendFriendRequestType,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body
  const currentUserid = req.userId

  if (!userId) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  if (userId == currentUserid) {
    res.status(400).json({
      message: 'Invalid Request: You can not send request to yourself'
    })
    return
  }

  try {
    let existingRequest = (await Friend.findOne({
      $or: [
        { user_1: currentUserid, user_2: userId },
        { user_1: userId, user_2: currentUserid }
      ]
    })) as FriendModelType | null

    if (existingRequest) {
      res.status(409).json({ message: 'Friend Request already exists' })
      return
    }

    const friendRequest = new Friend({ user_1: currentUserid, user_2: userId })
    await friendRequest.save()
    res.status(200).json({ message: 'Friend Request sent' })
  } catch (error) {
    next(error)
  }
}

const approveFriendRequest = async (
  req: UpdateFriendRequestType,
  res: Response,
  next: NextFunction
) => {
  const { friendRequestId } = req.body
  const currentUserid = req.userId

  if (!friendRequestId) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const updatedFriend = (await Friend.findOneAndUpdate(
      { _id: friendRequestId, user_2: currentUserid, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    )) as FriendModelType | null

    if (!updatedFriend) {
      res.status(404).json({ message: 'Friend Request not found' })
      return
    }

    res.status(200).json({ message: 'Friend Request Accepted Successfully' })
  } catch (error) {
    next(error)
  }
}

const RemoveFriend = async (
  req: SendFriendRequestType,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body
  const currentUserId = req.userId

  if (!userId) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const deletedFriend = await Friend.findOneAndDelete({
      $or: [
        { user_1: currentUserId, user_2: userId },
        { user_1: userId, user_2: currentUserId }
      ]
    })

    if (!deletedFriend) {
      res
        .status(404)
        .json({ message: 'Friend request or friendship not found' })
      return
    }

    res
      .status(200)
      .json({ message: 'Friend request or friendship removed successfully' })
  } catch (error) {
    next(error)
  }
}

const rejectedFriendRequest = async (
  req: UpdateFriendRequestType,
  res: Response,
  next: NextFunction
) => {
  const { friendRequestId } = req.body
  const currentUserid = req.userId

  if (!friendRequestId) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const updatedFriend = (await Friend.findOneAndUpdate(
      { _id: friendRequestId, user_2: currentUserid, status: 'pending' },
      { status: 'rejected' },
      { new: true }
    )) as FriendModelType | null

    if (!updatedFriend) {
      res.status(404).json({ message: 'Friend Request not found' })
      return
    }

    res.status(200).json({ message: 'Friend Request Rejected Successfully' })
  } catch (error) {
    next(error)
  }
}

const getReceivedFriendRequests = async (
  req: paginationRequestType,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.userId
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const search = (req.query.search as string) || ''

  try {
    let searchQuery = {}
    if (search) {
      searchQuery = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const query = {
      user_2: currentUserId,
      status: 'pending'
    }

    const total = await Friend.countDocuments(query)
    const friendRequests = await Friend.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'user_1',
        select: 'username firstName lastName profileImage',
        match: search ? searchQuery : {}
      })
      .sort({ created_at: -1 })

    const filteredRequests = friendRequests.filter(
      (request) => request.user_1 !== null
    )

    // Format the response
    const formattedRequests = filteredRequests.map((request: any) => ({
      id: request._id,
      senderId: request.user_1._id,
      senderName: `${request.user_1.firstName} ${request.user_1.lastName}`,
      senderUsername: request.user_1.username,
      senderProfileImage: request.user_1.profileImage || '',
      status: request.status,
      createdAt: request.created_at
    }))

    res.status(200).json({
      data: formattedRequests,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

const getNonFriendsList = async (
  req: paginationRequestType,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.userId
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const search = (req.query.search as string) || ''

  try {
    const friends = await Friend.find({
      $or: [{ user_1: currentUserId }, { user_2: currentUserId }],
      status: { $in: ['accepted', 'pending'] }
    })

    const friendIds = new Set<string>()
    friends.forEach((friend) => {
      if (friend.user_1.toString() !== currentUserId) {
        friendIds.add(friend.user_1.toString())
      }
      if (friend.user_2.toString() !== currentUserId) {
        friendIds.add(friend.user_2.toString())
      }
    })

    const searchQuery: any = {
      _id: { $ne: currentUserId, $nin: Array.from(friendIds) }
    }

    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await User.countDocuments(searchQuery)

    const nonFriends = await User.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('username firstName lastName profileImage')
      .sort({ createdAt: -1 })

    const formattedUsers = nonFriends.map((user: UserModelType) => ({
      id: user._id,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage || ''
    }))

    res.status(200).json({
      data: formattedUsers,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

const getFriendsList = async (
  req: paginationRequestType,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.userId
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const search = (req.query.search as string) || ''

  try {
    // Find all accepted friendships for the current user
    const friends = await Friend.find({
      $or: [{ user_1: currentUserId }, { user_2: currentUserId }],
      status: 'accepted'
    })

    // Extract friend user IDs (the user that isn't the current user)
    const friendIds = friends.map((friend) =>
      friend.user_1.toString() === currentUserId ? friend.user_2 : friend.user_1
    )

    // Build search query
    const searchQuery: any = {
      _id: { $in: friendIds }
    }

    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await User.countDocuments(searchQuery)

    const friendsList = await User.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('username firstName lastName profileImage')
      .sort({ createdAt: -1 })

    const formattedFriends = friendsList.map((user: any) => ({
      id: user._id,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage || ''
    }))

    res.status(200).json({
      data: formattedFriends,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  sendFriendRequest,
  approveFriendRequest,
  rejectedFriendRequest,
  getReceivedFriendRequests,
  getNonFriendsList,
  getFriendsList,
  RemoveFriend
}
