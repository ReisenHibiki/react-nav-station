import { NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

// 删除评论
export async function DELETE(
  request: Request,
  {params}:{params: Promise<{id: string}>}
) {
  try {
    // 获取评论id
    const { id } = await params;
    const commentId = Number(id);

    if (!Number.isInteger(commentId)) {
      return NextResponse.json(
        { message: "Invalid comment id" },
        { status: 400 }
      );
    }

    // 获取当前登录用户
    const supabase = await createClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 先查询评论属于谁
    const comment = await db
      .select({
        userId: comments.userId
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (comment.length === 0) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // 权限检查
    if (comment[0].userId !== user.id) {
      return NextResponse.json(
        { message: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // 删除评论
    const deleted = await db
      .delete(comments)
      .where(eq(comments.id, commentId))


    return NextResponse.json(
      {
        message: "Comment deleted",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Delete comment error:", error);

    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}