import { NextFunction, Request, Response } from 'express'
import Message from '../models/Message'

// Send Message
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId, text } = req.body
  const { userId } = req

  try {
    const message = new Message({ group: groupId, user: userId, text })
    await message.save()

    return res.status(201).json({ message })
  } catch (error) {
    next(error)
  }
}

// Delete Own Message
const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { messageId } = req.params
  const { userId } = req

  try {
    const message = await Message.findOne({ _id: messageId, user: userId })
    if (!message) return res.status(403).json({ message: 'Unauthorized' })

    await Message.findByIdAndDelete(messageId)
    return res.status(200).json({ message: 'Message deleted' })
  } catch (error) {
    next(error)
  }
}

// Like a Message
const likeMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { messageId } = req.params
  const { userId } = req

  try {
    const message = await Message.findById(messageId)
    if (!message) return res.status(404).json({ message: 'Message not found' })

    const isLiked = message.likes.includes(userId)
    if (isLiked) {
      message.likes = message.likes.filter((id) => id.toString() !== userId)
    } else {
      message.likes.push(userId)
    }

    await message.save()
    return res.status(200).json({ message })
  } catch (error) {
    next(error)
  }
}

export { sendMessage, deleteMessage, likeMessage }
