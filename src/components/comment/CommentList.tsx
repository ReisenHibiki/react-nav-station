'use client';

import type { Comment } from "@/types/comment";
import CommentItem from "@/components/comment/CommentItem";

type Props = {
  comments: Comment[];
  currentUserId: string | null;
  loading: boolean;
  onDeleteSuccess: (id: number)=>void;
};

export default function CommentList({
  comments,
  currentUserId,
  loading,
  onDeleteSuccess
}: Props) {

  if (loading) {
    return (
      <div className="py-6 text-center text-gray-500">
        加载评论中...
      </div>
    );
  }


  if (comments.length === 0) {
    return (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* 空状态图标 */}
            <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-700">
              还没有评论
            </p>
            <p className="mt-1 text-sm text-gray-400">
              快来发表第一条评论吧
            </p>
          </div>
        );
  }


  return (
    <div>

      {comments.map((comment)=>(
        <CommentItem
        key={comment.id}
        comment={comment}
        currentUserId={currentUserId}
        onDeleteSuccess={onDeleteSuccess}
        />
      ))}

    </div>
  );
}