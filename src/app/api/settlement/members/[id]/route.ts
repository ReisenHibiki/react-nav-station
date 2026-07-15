import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { settlementMembers } from "@/db/schema";


// owner踢出聚落成员  DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
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

    const paramsData = await params
    const memberId = Number(paramsData.id);
    if (Number.isNaN(memberId) || memberId <= 0) {
      return NextResponse.json(
        { message: "成员ID错误" },
        { status: 400 }
      );
    }

    // 1. 查询当前用户身份，确认是不是 owner
    const [operator] = await db
      .select({
        settlementId: settlementMembers.settlementId,
        role: settlementMembers.role
      })
      .from(settlementMembers)
      .where(eq(settlementMembers.userId, user.id))
      .limit(1);

    if (!operator) {
      return NextResponse.json(
        { message: "你没有加入聚落" },
        { status: 403 }
      );
    }

    if (operator.role !== "owner") {
      return NextResponse.json(
        { message: "没有权限移除成员" },
        { status: 403 }
      );
    }

    // 2. 查询目标成员，必须属于当前 owner 的聚落
    const [target] = await db
      .select()
      .from(settlementMembers)
      .where(
        and(
          eq(settlementMembers.id, memberId),
          eq(settlementMembers.settlementId, operator.settlementId)
        )
      )
      .limit(1);

    if (!target) {
      return NextResponse.json(
        { message: "成员不存在" },
        { status: 404 }
      );
    }

    // 3. 防止删除 owner
    if (target.role === "owner") {
      return NextResponse.json(
        { message: "不能移除聚落拥有者" },
        { status: 400 }
      );
    }

    // 4. 删除成员
    await db
      .delete(settlementMembers)
      .where(eq(settlementMembers.id, memberId));

    return NextResponse.json(
      { message: "成员已移除" }
    );
  } catch (error) {
    console.error("remove member error:", error);
    return NextResponse.json(
      { message: "服务器错误" },
      { status: 500 }
    );
  }
}