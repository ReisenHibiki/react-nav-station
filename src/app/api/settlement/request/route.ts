import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  settlementRequests
} from "@/db/schema";

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