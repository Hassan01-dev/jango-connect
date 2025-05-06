import { NextFunction, Request, Response } from 'express'
import Notification from '../models/Notification'

// Get Notifications for a User (Paginated)
const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req // Assume extracted from JWT
  const { page = 1 } = req.query
  const limit = 10

  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((Number(page) - 1) * limit)

    res.status(200).json({ notifications })
  } catch (error) {
    next(error)
  }
}

// Mark Notification as Read
const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params

  try {
    await Notification.findByIdAndUpdate(notificationId, { read: true })
    res.status(200).json({ message: 'Notification marked as read' })
  } catch (error) {
    next(error)
  }
}

// Create Notification
const createNotification = async (
  user: string,
  sender: string,
  type: string,
  sourceId: string,
  sourceType: string,
  message: string,
  next: NextFunction
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
  } catch (error) {
    next(error)
  }
}

export { getNotifications, markAsRead, createNotification }
