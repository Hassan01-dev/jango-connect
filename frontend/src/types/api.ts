export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderProfileImage: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  createdAt: string;
}


export interface Post {
  id: string;
  user_id: string;
  content: string;
  media: string[];
  likes_count: number;
  comments_count: number;
}
