export type Message = {
  id: number | string;
  text: string;
  sender: "me" | "other";
};

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  profilePic: string;
}
export type SignUpUser = {
  email: string,
  password: string
}
export interface ChatMessage {
  id: number;
  sender: User;
  content: string;
  createdAt?: Date;
  isRead?: boolean;
}

export type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  contact: string;
  profile_pic: string;
  message: string;
  isContact: boolean;
};