import mongoose from 'mongoose'
import PostModelType from '../utils/types/models/posts'

const { Schema, model, Types } = mongoose

const PostSchema = new Schema<PostModelType>(
  {
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
      unique: true
    },
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content is required'],
      maxLength: [500, 'Content must not exceed 500 characters']
    },
    media: [
      {
        type: String,
        match: [
          /^(http|https):\/\/.+\.(jpg|jpeg|png|gif|mp4|mov|avi)$/,
          'Invalid media URL format'
        ]
      }
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: 'Like'
      }
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Post = model<PostModelType>('Post', PostSchema)

export default Post
