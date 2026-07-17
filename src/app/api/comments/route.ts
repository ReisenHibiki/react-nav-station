import { db } from "@/db";
import { comments, profiles } from "@/db/schema";
import { eq, and, desc, count, lt, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


// 使用cursor pagination游标
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");
    
    // 限制最大 limit 为 100
    const limit = Math.min(
      Number(searchParams.get("limit") ?? 20),
      100
    );

    // 游标参数
    const cursorCreatedAt = searchParams.get("cursorCreatedAt");
    const cursorId = searchParams.get("cursorId");

    // 参数验证
    if (!targetType || !targetId) {
      return NextResponse.json(
        { message: "Missing required parameters: targetType and targetId" },
        { status: 400 }
      );
    }

    // 基础查询条件
    const conditions = [
      eq(comments.targetType, targetType),
      eq(comments.targetId, targetId)
    ];

    // 游标分页条件：查询比游标更旧的数据
    if (cursorCreatedAt && cursorId) {
      conditions.push(
        or(
          // 情况1: 创建时间更早
          lt(comments.createdAt, new Date(cursorCreatedAt)),
          // 情况2: 创建时间相同，但ID更小
          and(
            eq(comments.createdAt, new Date(cursorCreatedAt)),
            lt(comments.id, Number(cursorId))
          )
        )!
      );
    }

    // 查询数据（多查一条用于判断是否有更多数据）
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: profiles.id,
          username: profiles.username,
          avatar: profiles.avatar
        }
      })
      .from(comments)
      .leftJoin(profiles, eq(comments.userId, profiles.id))
      .where(and(...conditions))
      .orderBy(
        desc(comments.createdAt),
        desc(comments.id)
      )
      .limit(limit + 1);

    // 判断是否有下一页
    const hasMore = result.length > limit;
    const commentsData = hasMore ? result.slice(0, limit) : result;

    // 生成下一个游标
    const last = commentsData[commentsData.length - 1];
    const nextCursor = hasMore && last
      ? {
          createdAt: last.createdAt,
          id: last.id
        }
      : null;

    return NextResponse.json({
      comments: commentsData,
      nextCursor,
      hasMore,
      limit
    });

  } catch (error) {
    // 错误处理
    console.error("Comments API Error:", error);
    
    // 区分数据库错误和其他错误
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: "Failed to fetch comments",
          error: process.env.NODE_ENV === "development" ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// 弃用！Abandoned！！offset游标分页法，想了下不适合评论组件
// export async function GET(req:NextRequest){

//     const searchParams = req.nextUrl.searchParams
//     const targetId = searchParams.get("targetId")
//     const targetType = searchParams.get("targetType")
//     const page = Number(searchParams.get("page") ?? 1);
//     const pageSize = 20;

//       if (!targetType || !targetId) {
//     return NextResponse.json(
//       {
//         error: "Missing targetType or targetId"
//       },
//       {
//         status:400
//         }
//     );
//     }
        
//     // 查询评论
//     const result = await db
//     .select({
//         id: comments.id,
//         content: comments.content,
//         createdAt: comments.createdAt,

//         user:{
//         id: profiles.id,
//         username: profiles.username,
//         avatar: profiles.avatar,
//         }
//     })
//     .from(comments)
//     .leftJoin(
//         profiles,
//         eq(comments.userId, profiles.id)
//     )
//     .where(
//         and(
//         eq(comments.targetType,targetType),
//         eq(comments.targetId,targetId)
//         )
//     )
//     .orderBy(desc(comments.createdAt))
//     .limit(pageSize)
//     .offset((page-1)*pageSize);

//     // 查询总数
//     const totalResult = await db
//     .select({count:count()})
//     .from(comments)
//     .where(
//         and(
//             eq(comments.targetId, targetId),
//             eq(comments.targetType, targetType)
//         )
//     )
//     const total =Number(totalResult[0].count);
//     // 向上取整
//     const totalPages =Math.ceil(total/pageSize);

//     return NextResponse.json({
//         comments:result,
//         pagination:{
//             page,
//             pageSize,
//             total,
//             totalPages,
//             hasMore: page < totalPages
//         }
//     })

// }