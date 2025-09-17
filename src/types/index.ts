export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: Date;
  createdBy: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}