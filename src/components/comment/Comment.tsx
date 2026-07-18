'use client';

import { useCallback, useEffect, useState } from "react";
import type {
  Comment,
  CommentsResponse,
  Cursor
} from "@/types/comment";

type Props = {
  targetType: "card" | "profile" | "settlement";
  targetId: string;
};

export default function Comment({
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

      const response = await fetch(`/api/comments?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data: CommentsResponse = await response.json();

      setCurrentUserId(data.currentUserId);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);

      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
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
  if (!nextCursor || loadingMore) return;
  fetchComments(nextCursor, true);
};

  return (

    <div className="mt-6">

      {/* 下一步这里放 CommentInput */}

      {/* 下一步这里放 CommentList */}

      {/* 下一步这里放 LoadMore */}
      <button onClick={()=>{loadMore}}></button>

      <pre className="text-xs">

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

      </pre>

    </div>

  );

}