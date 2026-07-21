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

export const COMMENT_TYPE = {
  CARD: "card",
  PROFILE: "profile",
  SETTLEMENT: "settlement",
  POST: "post"
} as const;

export type CommentType =
  typeof COMMENT_TYPE[keyof typeof COMMENT_TYPE];

export const ALLOWED_COMMENT_TYPES = Object.values(COMMENT_TYPE);