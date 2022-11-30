export interface User {
  id: string;
  name: string | null;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: User;
}

export interface Posts {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  updatedAt?: Date;
  user: User;
  likes: Like[];
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}
