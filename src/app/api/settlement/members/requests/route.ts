import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { settlementMembers, settlementRequests, profiles } from "@/db/schema";


// 当前settlement的owner 查询加入申请  GET
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "请先登录" },
        { status: 401 }
      );
    }

    // 1. 获取当前用户的聚落身份，确认是不是 owner
    const [owner] = await db
      .select({
        settlementId: settlementMembers.settlementId,
        role: settlementMembers.role
      })
      .from(settlementMembers)
      .where(eq(settlementMembers.userId, user.id))
      .limit(1);

    if (!owner) {
      return NextResponse.json(
        { message: "你还没有加入聚落" },
        { status: 403 }
      );
    }

    if (owner.role !== "owner") {
      return NextResponse.json(
        { message: "没有权限管理成员" },
        { status: 403 }
      );
    }

    // 2. 查询 pending 申请
    const requests = await db
      .select({
        id: settlementRequests.id,
        createdAt: settlementRequests.createdAt,
        user: {
          id: profiles.id,
          username: profiles.username,
          avatar: profiles.avatar
        }
      })
      .from(settlementRequests)
      .innerJoin(profiles, eq(settlementRequests.userId, profiles.id))
      .where(
        and(
          eq(settlementRequests.settlementId, owner.settlementId),
          eq(settlementRequests.status, "pending")
        )
      );

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("get member requests error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}