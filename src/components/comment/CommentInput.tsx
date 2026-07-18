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
      
      const comment = await response.json()
      onSuccess(comment);

    } catch (error) {
      console.error(error);
      alert("Failed to publish comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border p-4">

      <textarea
        className="min-h-28 w-full resize-none rounded-lg border p-3 outline-none"
        placeholder="Write a comment..."
        maxLength={500}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="mt-2 flex items-center justify-between">

        <span className="text-sm text-gray-500">
          {content.length}/500
        </span>

        <button
          className="rounded-lg bg-sky-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || content.trim().length === 0}
          onClick={submit}
        >
          {loading ? "Posting..." : "Post"}
        </button>

      </div>

    </div>
  );
}