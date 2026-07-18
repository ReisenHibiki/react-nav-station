'use client';

import { useState } from "react";
import type { Comment } from "@/types/comment";

type Props = {
  comment: Comment;
  currentUserId: string | null;
  onDeleteSuccess: (id: number) => void;
};

export default function CommentItem({
  comment,
  currentUserId,
  onDeleteSuccess
}: Props) {
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUserId === comment.user?.id;

  const deleteComment = async () => {
    if (deleting) return;

    const confirmDelete = window.confirm("Delete this comment?");
    if (!confirmDelete) return;

    try {
      setDeleting(true);
    // 删除组件接口
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      onDeleteSuccess(comment.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete comment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group flex gap-4 px-4 py-5 transition-colors duration-150 hover:bg-gray-50">
      {/* 头像 */}
      <div className="shrink-0">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-linear-to-br from-blue-100 to-blue-200 ring-2 ring-white">
          {comment.user?.avatar ? (
            <img
              src={comment.user.avatar}
              alt={comment.user?.username ?? "用户头像"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-blue-600">
              {comment.user?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {/* 用户名 + 操作按钮 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {comment.user?.username ?? "未知用户"}
            </span>
            {isOwner && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                我的评论
              </span>
            )}
          </div>

          {isOwner && (
            <button
              disabled={deleting}
              onClick={deleteComment}
              className={`
                flex items-center gap-1.5
                px-2.5 py-1
                rounded-lg
                text-xs font-medium
                transition-all duration-200
                ${
                  deleting
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }
              `}
            >
              {deleting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  删除中
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除
                </>
              )}
            </button>
          )}
        </div>

        {/* 内容 */}
        <p className="mt-1.5 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-gray-700">
          {comment.content}
        </p>

        {/* 时间 */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span>
            {new Date(comment.createdAt).toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}