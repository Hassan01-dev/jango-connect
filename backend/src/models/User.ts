import mongoose from 'mongoose'
import UserModelType from '../utils/types/models/users'

const { Schema, model, Types } = mongoose

const UserSchema = new Schema<UserModelType>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Username is required'],
      match: [
        /^[A-Za-z0-9_]+$/,
        'Username must only contain letters, numbers, and underscores'
      ]
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First Name is required'],
      max: [20, 'First Name must not exceed 20 characters'],
      min: [3, 'First Name must be at least 3 characters'],
      match: [/^[A-Za-z ]+$/, 'First Name must only contain letters and spaces']
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last Name is required'],
      max: [20, 'Last Name must not exceed 20 characters'],
      min: [3, 'Last Name must be at least 3 characters'],
      match: [/^[A-Za-z ]+$/, 'Last Name must only contain letters and spaces']
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      validate: {
        validator: function (value: string) {
          return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value)
        },
        message:
          'Password must include at least one uppercase letter, one lowercase letter, and one number.'
      }
    },
    profileImage: { type: String, default: '' },
    bio: {
      type: String,
      trim: true,
      maxLength: [160, 'Bio must not exceed 160 characters']
    },
    friends: [{ type: Types.ObjectId, ref: 'Friend', required: true }]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const User = model<UserModelType>('User', UserSchema)

export default User
