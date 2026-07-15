import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  settlementRequests,
  settlements,
  cards
} from "@/db/schema";

// 获取当前用户pending申请
export async function GET(){

  try{
    const supabase = await createClient();
    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();
    if(!user){
      return NextResponse.json(
        {
          message:"请先登录"
        },
        {
          status:401
        }
      );
    }

    const [request] =
      await db
        .select({
          id:settlementRequests.id,
          status:settlementRequests.status,
          createdAt:settlementRequests.createdAt,
          settlement:{
            id:settlements.id,
            cardId:settlements.cardId,
            name:cards.name,
            icon:cards.icon,
            banner:settlements.banner
          }
        })
        .from(settlementRequests)
        .innerJoin(
          settlements,
          eq(
            settlementRequests.settlementId,
            settlements.id
          )
        )
        .innerJoin(
          cards,
          eq(
            settlements.cardId,
            cards.id
          )
        )
        .where(
          and(
            eq(
              settlementRequests.userId,
              user.id
            ),
            eq(
              settlementRequests.status,
              "pending"
            )
          )
        )
        .limit(1);

    if(!request){
      return NextResponse.json({
        request:null
      });
    }

    return NextResponse.json({
      request
    });

  }catch(error){

    console.error(
      "get settlement request error:",
      error
    );
    return NextResponse.json(
      {
        message:"服务器错误"
      },
      {
        status:500
      }
    );
  }
}


// 删除（撤回）申请 DELETE
export async function DELETE(){

  try{
    const supabase = await createClient();

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();

    if(!user){
      return NextResponse.json(
        {
          message:"请先登录"
        },
        {
          status:401
        }
      );
    }

    const deletedRequests = await db
    .delete(settlementRequests)
    .where(
        and(
        eq(settlementRequests.userId,user.id),
        eq(settlementRequests.status,"pending")
        )
    )
    .returning({
  id: settlementRequests.id
});

    if(deletedRequests.length === 0){
    return NextResponse.json(
        {
        message:"没有可撤回的申请"
        },
        {
        status:404
        }
    );
    }

    return NextResponse.json({
    message:"撤回成功"
    });


  }catch(error){
    console.error(error);
    return NextResponse.json(
      {
        message:"服务器错误"
      },
      {
        status:500
      }
    );
  }

}