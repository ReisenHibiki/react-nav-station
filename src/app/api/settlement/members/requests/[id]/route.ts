import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { settlementMembers, settlementRequests } from "@/db/schema";


// owner审核修改request申请接口 PATCH
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "请先登录" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { message: "非法操作" },
        { status: 400 }
      );
    }
    
    const paramsData = await params
    const requestId = Number(paramsData.id);
    if (Number.isNaN(requestId) || requestId <= 0) {
      return NextResponse.json(
        { message: "申请ID错误" },
        { status: 400 }
      );
    }

    // 1. 查询申请
    const [request] = await db
      .select()
      .from(settlementRequests)
      .where(eq(settlementRequests.id, requestId))
      .limit(1);

    if (!request) {
      return NextResponse.json(
        { message: "申请不存在" },
        { status: 404 }
      );
    }

    // 2. 验证当前用户是不是该聚落 owner
    const [owner] = await db
      .select()
      .from(settlementMembers)
      .where(
        and(
          eq(settlementMembers.userId, user.id),
          eq(settlementMembers.settlementId, request.settlementId),
          eq(settlementMembers.role, "owner")
        )
      )
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { message: "没有审核权限" },
        { status: 403 }
      );
    }

    // 防止重复审核
    if (request.status !== "pending") {
      return NextResponse.json(
        { message: "该申请已经处理" },
        { status: 400 }
      );
    }

    // 3. 事务处理
    await db.transaction(async (tx) => {
      if (action === "approve") {
        // 加入成员表
        await tx.insert(settlementMembers).values({
          settlementId: request.settlementId,
          userId: request.userId,
          role: "member"
        });
      }

      // 更新申请状态
      await tx
        .update(settlementRequests)
        .set({
          status: action === "approve" ? "approved" : "rejected"
        })
        .where(eq(settlementRequests.id, requestId));
    });

    return NextResponse.json({
      message: action === "approve" ? "已通过申请" : "已拒绝申请"
    });
  } catch (error) {
    console.error("handle member request error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}