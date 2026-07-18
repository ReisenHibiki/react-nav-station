'use client';

import { useState } from "react";
import { Comment } from "@/types/comment";

type Props = {
  targetType: "card" | "profile" | "settlement";
  targetId: string;
  onSuccess: (comment:Comment) => void;
};

export default function CommentInput({
  targetType,
  targetId,
  onSuccess
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const text = content.trim();

    if (!text) return;
    if (text.length > 500) return;

    try {
      setLoading(true);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          targetType,
          targetId,
          content: text
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      setContent("");
      
      const data = await response.json()
      onSuccess(data.comment);

    } catch (error) {
      console.error(error);
      alert("Failed to publish comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 评论输入框 */}
      <div className="relative">
        <textarea
          className="
            w-full min-h-30
            px-4 py-3
            bg-gray-50
            border-2 border-gray-200
            rounded-xl
            text-gray-900
            placeholder-gray-400
            resize-none
            transition-all duration-200
            focus:outline-none
            focus:border-blue-500
            focus:ring-4 focus:ring-blue-500/20
            focus:bg-white
            hover:border-gray-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          placeholder="写下你的想法..."
          maxLength={200}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        
        {/* 字符数提示 - 接近上限时变色 */}
        <div className="absolute bottom-3 right-3">
          <span className={`
            text-xs font-medium
            ${content.length > 180 
              ? content.length === 200 
                ? 'text-red-500' 
                : 'text-orange-400' 
              : 'text-gray-400'
            }
            transition-colors duration-200
          `}>
            {content.length}/200
          </span>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-end">
        {/* 发布按钮 */}
        <button
          className={`
            px-6 py-2.5
            rounded-xl
            font-medium text-sm
            transition-all duration-200
            transform active:scale-95
            focus:outline-none focus:ring-4 focus:ring-blue-500/30
            ${
              loading || content.trim().length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
            }
          `}
          disabled={loading || content.trim().length === 0}
          onClick={submit}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              发布中...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              发布评论
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}