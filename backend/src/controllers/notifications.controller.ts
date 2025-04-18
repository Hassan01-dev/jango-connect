import { Request, Response } from 'express'
import Notification from '../models/Notification'

// Get Notifications for a User (Paginated)
const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req // Assume extracted from JWT
  const { page = 1 } = req.query
  const limit = 10

  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((Number(page) - 1) * limit)

    return res.status(200).json({ notifications })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Mark Notification as Read
const markAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params

  try {
    await Notification.findByIdAndUpdate(notificationId, { read: true })
    return res.status(200).json({ message: 'Notification marked as read' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

// Create Notification
const createNotification = async (
  user: string,
  sender: string,
  type: string,
  sourceId: string,
  sourceType: string,
  message: string
) => {
  try {
    const notification = new Notification({
      user,
      sender,
      type,
      source_id: sourceId,
      source_type: sourceType,
      message
    })
    await notification.save()
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return res
      .status(500)
      .json({ message: 'Server Error', error: errorMessage })
  }
}

export { getNotifications, markAsRead, createNotification }
