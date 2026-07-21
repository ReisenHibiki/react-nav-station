import { db } from "@/db";
import { comments, profiles } from "@/db/schema";
import { eq, and, desc, count, lt, or, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_COMMENT_TYPES, CommentType } from "@/types/comment";

const allowedTargetTypes=ALLOWED_COMMENT_TYPES;

// 使用cursor pagination游标
export async function GET(request: NextRequest) {
  try {
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams
    const targetType = searchParams.get("targetType") as CommentType;
    const targetId = searchParams.get("targetId");
    
    // 限制最大 limit 为 100 并且校验合法参数
    const rawLimit = Number(searchParams.get("limit") ?? 20);
    const limit = Number.isInteger(rawLimit) && rawLimit > 0
    ? Math.min(rawLimit, 100)
    : 20;

    // 2. 游标参数校验和转换
    const cursorIdNumber = searchParams.get("cursorId")
      ? Number(searchParams.get("cursorId"))
      : null;

    const cursorDate = searchParams.get("cursorCreatedAt")
      ? new Date(searchParams.get("cursorCreatedAt")!)
      : null;

    // 参数验证
    if (!targetType || !targetId) {
      return NextResponse.json(
        { message: "Missing required parameters: targetType and targetId" },
        { status: 400 }
      );
    }
    if (!allowedTargetTypes.includes(targetType)) {
      return NextResponse.json(
        { message: "Invalid targetType" },
        { status: 400 }
    );
    }

    // 基础查询条件
    const conditions = [
      eq(comments.targetType, targetType),
      eq(comments.targetId, targetId)
    ];

    // 游标分页条件：只有游标参数都有效时才添加
    if (cursorDate && cursorIdNumber !== null && !isNaN(cursorIdNumber)) {
      conditions.push(
        or(
          lt(comments.createdAt, cursorDate),
          and(
            eq(comments.createdAt, cursorDate),
            lt(comments.id, cursorIdNumber)
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
      currentUserId:user?.id ?? null,
      nextCursor,
      hasMore,
    });

  } catch (error) {
    console.error("Comments API Error:", error);
    
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

// 发布评论API POST
export async function POST(request: Request) {
  try {

    const supabase = await createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 获取body
    const body = await request.json();
    const { targetType, targetId, content } = body;

    // 参数验证
    if (!targetType || !targetId || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // targetType验证
    if(!allowedTargetTypes.includes(targetType)){
        return NextResponse.json(
        { message: "Invalid targetType" },
        { status: 400 }
      );
    }

    // 内容验证
    const text = String(content).trim();
    if (text.length === 0) {
      return NextResponse.json(
        { message: "Content cannot be empty" },
        { status: 400 }
      );
    }
    if (text.length > 500) {
      return NextResponse.json(
        { message: "Content too long" },
        { status: 400 }
      );
    }

    // 防止滥发评论，检查评论冷却
    const lastComment = await db
    .select({
      createdAt: comments.createdAt
    })
    .from(comments)
    .where(
      eq(comments.userId, user.id)
    )
    .orderBy(
      desc(comments.createdAt)
    )
    .limit(1);

    if(lastComment.length > 0){
      const lastTime = lastComment[0].createdAt.getTime();
      const now = Date.now();

      const diff = (now - lastTime) / 1000;
      const CD = 10
      if(diff < CD){
        return NextResponse.json(
          {
            message: `请等待 ${Math.ceil(CD - diff)} 秒后再试`
          },
          {
            status:429
          }
        );
      }
    }

   // 防止滥发评论一天只能发30条
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const todayComments = await db
    .select({
      count:count()
    })
    .from(comments)
    .where(
      and(
        eq(comments.userId,user.id),
        gt(
          comments.createdAt,
          startOfDay
        )
      )
    );

    if(todayComments[0].count >= 20){
      return NextResponse.json(
        {
          message:"每日评论数量已达到上限"
        },
        {
          status:429
        }
      );
    }
  

    // 插入评论
    const result = await db
      .insert(comments)
      .values({
        userId: user.id,
        targetType,
        targetId,
        content: text
      })
      .returning();

    // 查询最新插入减少前端查询,返回数据结构和GET一致
    const comment = await db
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
    .leftJoin(
      profiles,
      eq(comments.userId, profiles.id)
    )
    .where(
      eq(comments.id, result[0].id)
    )
    .limit(1);

    // 返回数据
    return NextResponse.json(
      { comment: comment[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create Comment Error:", error);

    return NextResponse.json(
      { message: "发布评论失败" },
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