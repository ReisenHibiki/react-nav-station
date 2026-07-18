import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { wallets, walletTransactions } from "@/db/schema";

const CHECK_IN_REWARD = 200;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      // 使用 Drizzle 的 FOR UPDATE 语法
      const [wallet] = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.userId, user.id))
        .for('update');

      if (!wallet) {
        throw new Error("WALLET_NOT_FOUND");
      }

      // 检查是否已签到
      if (wallet.lastCheckIn) {
        const last = new Date(wallet.lastCheckIn);
        const now = new Date();

        if (
          last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate()
        ) {
          throw new Error("ALREADY_CHECKED_IN");
        }
      }

      // 插入签到记录
      await tx.insert(walletTransactions).values({
        fromWalletId: null,
        toWalletId: wallet.id,
        amount: CHECK_IN_REWARD,
        type: "check_in",
        description: "Daily reward"
      });

      // 更新钱包
      const [updated] = await tx
        .update(wallets)
        .set({
          balance: wallet.balance + CHECK_IN_REWARD,
          totalEarned: wallet.totalEarned + CHECK_IN_REWARD,
          lastCheckIn: new Date()
        })
        .where(eq(wallets.id, wallet.id))
        .returning();

      return updated;
    });

    return NextResponse.json({ wallet: result });
  } catch (error) {

      if (error instanceof Error) {
        // 现在可以安全访问 error.message
        if (error.message === "ALREADY_CHECKED_IN") {
        return NextResponse.json(
            { error: "今日已签到" },
            { status: 400 }
        );
        }

        if (error.message === "WALLET_NOT_FOUND") {
        return NextResponse.json(
            { error: "钱包不存在" },
            { status: 404 }
        );
        }
    }

    // 其他错误
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "签到失败，请稍后重试" },
      { status: 500 }
    );
  }
}