export interface Poll {
  id: number;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: Date;
  createdBy: string;
  userId: string; // owner user id
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}