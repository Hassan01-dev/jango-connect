import { Request, Response } from 'express'
import Group from '../models/Group'
import GroupMember from '../models/GroupMember'

// Create Group
const createGroup = async (req: Request, res: Response) => {
  const { name, description } = req.body
  const { userId } = req // Extracted from JWT

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Update Group Details
const updateGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params
  const { name, description } = req.body

  try {
    await Group.findByIdAndUpdate(groupId, { name, description })
    return res.status(200).json({ message: 'Group updated successfully' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Delete Group
const deleteGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params

  try {
    await Group.findByIdAndDelete(groupId)
    await GroupMember.deleteMany({ group: groupId })
    return res.status(200).json({ message: 'Group deleted' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export { createGroup, updateGroup, deleteGroup }
