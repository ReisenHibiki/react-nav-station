export type CommentUser = {
  id: string | null;
  username: string | null;
  avatar: string | null;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: CommentUser;
};

export type Cursor = {
  createdAt: string;
  id: number;
};

export type CommentsResponse = {
  comments: Comment[];
  currentUserId: string | null;
  nextCursor: Cursor | null;
  hasMore: boolean;
};