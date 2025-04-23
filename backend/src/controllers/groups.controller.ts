import { NextFunction, Request, Response } from 'express'
import Group from '../models/Group'
import GroupMember from '../models/GroupMember'

// Create Group
const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body
  const { userId } = req

  try {
    const group = new Group({ name, description, createdBy: userId })
    await group.save()

    // Add creator as admin in GroupMember
    await new GroupMember({
      group: group._id,
      user: userId,
      role: 'admin'
    }).save()

    return res.status(201).json({ group })
  } catch (error) {
    next(error)
  }
}

// Update Group Details
const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params
  const { name, description } = req.body

  try {
    await Group.findByIdAndUpdate(groupId, { name, description })
    return res.status(200).json({ message: 'Group updated successfully' })
  } catch (error) {
    next(error)
  }
}

// Delete Group
const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params

  try {
    await Group.findByIdAndDelete(groupId)
    await GroupMember.deleteMany({ group: groupId })
    return res.status(200).json({ message: 'Group deleted' })
  } catch (error) {
    next(error)
  }
}

export { createGroup, updateGroup, deleteGroup }
