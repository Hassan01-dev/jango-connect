import { Request, Response } from 'express'
import Message from '../models/Message'

// Send Message
const sendMessage = async (req: Request, res: Response) => {
  const { groupId, text } = req.body
  const { userId } = req

  try {
    const message = new Message({ group: groupId, user: userId, text })
    await message.save()

    return res.status(201).json({ message })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Delete Own Message
const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params
  const { userId } = req

  try {
    const message = await Message.findOne({ _id: messageId, user: userId })
    if (!message) return res.status(403).json({ message: 'Unauthorized' })

    await Message.findByIdAndDelete(messageId)
    return res.status(200).json({ message: 'Message deleted' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Like a Message
const likeMessage = async (req: Request, res: Response) => {
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export { sendMessage, deleteMessage, likeMessage }
