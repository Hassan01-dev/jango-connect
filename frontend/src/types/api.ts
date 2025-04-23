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
