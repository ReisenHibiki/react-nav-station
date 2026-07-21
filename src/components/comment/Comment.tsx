'use client';

import { useCallback, useEffect, useState } from "react";
import CommentInput from "@/components/comment/CommentInput";
import CommentList from "@/components/comment/CommentList";
import Link from "next/link";
import type {
  Comment,
  CommentsResponse,
  Cursor,
  CommentType
} from "@/types/comment";

type Props = {
  name:string
  targetType: CommentType;
  targetId: string;
};

export default function Comment({
  name,
  targetType,
  targetId
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<Cursor | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);



const fetchComments = useCallback(
  async (cursor?: Cursor, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);

      const params = new URLSearchParams({
        targetType,
        targetId,
        limit: "20",
      });

      if (cursor) {
        params.set("cursorId", String(cursor.id));
        params.set("cursorCreatedAt", cursor.createdAt);
      }
      // 查询评论接口
      const response = await fetch(`/api/comments?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data: CommentsResponse = await response.json();

      setCurrentUserId(data.currentUserId);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);

      if (append) {
        setComments(prev => {
            const ids = new Set(prev.map(c => c.id));
            // 简单去重防止因网络原因重复
            return [
                ...prev,
                ...data.comments.filter(c => !ids.has(c.id))
            ];
        });
      } else {
        setComments(data.comments);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  },
  [targetId, targetType]
);

useEffect(() => {
    // 清除旧数据优化用户体验
    setComments([]);
    setLoading(true);

    fetchComments();
}, [fetchComments]);


const loadMore = () => {
  if (!nextCursor || loadingMore || loading) return;
  fetchComments(nextCursor, true);
};


const deleteComment = (id:number)=>{
  setComments(prev =>
    prev.filter(comment => comment.id !== id)
  );
};

const onSuccess = (comment:Comment) => {
  setComments(prev => [comment, ...prev]);
  console.log(comment)
  console.log(comments)
}


  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* 评论区标题 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {name}
          {comments.length > 0 && targetType !== 'post' && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* 评论输入区域 */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all hover:shadow-md">
        {!loading ? currentUserId ? (
          <CommentInput
            targetType={targetType}
            targetId={targetId}
            onSuccess={onSuccess}
          />
        ) : (
          <div className="text-center py-6 select-none">
            <p className="text-gray-500">
              💬 登录后即可发表评论
            </p>
            <Link href={'/sign-in'}><div className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow">
              立即登录
            </div></Link>
          </div>
        ): <div className="w-full h-8 bg-slate-300"></div> }
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          loading={loading}
          onDeleteSuccess={deleteComment}
        />
      </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="
              px-8 py-3
              bg-linear-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800
              text-white font-medium
              rounded-xl
              shadow-md hover:shadow-lg
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                加载中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                加载更多评论
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}

      {/* 开发时检查数据的 */}
      {/* <pre className="text-xs">
        {JSON.stringify(
          {
            comments,
            currentUserId,
            hasMore,
            nextCursor
          },
          null,
          2
        )}
      </pre> */}
    </div>
  );
}