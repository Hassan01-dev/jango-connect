import { NextFunction, Request, Response } from 'express'
import GroupMember from '../models/GroupMember'

// Add User to Group
const addUserToGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId, userId, role = 'member' } = req.body

  try {
    const existingMember = await GroupMember.findOne({
      group: groupId,
      user: userId
    })
    if (existingMember)
      return res.status(400).json({ message: 'User already in group' })

    const member = new GroupMember({ group: groupId, user: userId, role })
    await member.save()

    return res.status(200).json({ message: 'User added to group', member })
  } catch (error) {
    next(error)
  }
}

// Remove User from Group
const removeUserFromGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId, userId } = req.body

  try {
    await GroupMember.findOneAndDelete({ group: groupId, user: userId })
    return res.status(200).json({ message: 'User removed from group' })
  } catch (error) {
    next(error)
  }
}

export default { addUserToGroup, removeUserFromGroup }
