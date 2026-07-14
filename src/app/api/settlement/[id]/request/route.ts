import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  settlements,
  settlementMembers,
  settlementRequests
} from "@/db/schema";


type Props = {
  params:{
    id:string;
  };
};

// 申请加入聚落    POST
export async function POST(
  req:NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
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


  const { id } = await params;
  const settlementId = Number(id);

    if(!settlementId){
      return NextResponse.json(
        {
          message:"聚落ID错误"
        },
        {
          status:400
        }
      );
    }

    // 检查聚落是否存在
    const [settlement] = await db
      .select()
      .from(settlements)
      .where(
        eq(
          settlements.id,
          settlementId
        )
      )
      .limit(1);

    if(!settlement){
      return NextResponse.json(
        {
          message:"聚落不存在"
        },
        {
          status:404
        }
      );
    }

    // 检查用户是否已经加入聚落
    const [member] = await db
      .select()
      .from(settlementMembers)
      .where(
        eq(
          settlementMembers.userId,
          user.id
        )
      )
      .limit(1);


    if(member){
      return NextResponse.json(
        {
          message:"你已经加入聚落"
        },
        {
          status:400
        }
      );
    }

    // 检查是否已经申请过
    const [request] = await db
      .select()
      .from(settlementRequests)
      .where(
        and(
          eq(
            settlementRequests.userId,
            user.id
          ),
          eq(
            settlementRequests.settlementId,
            settlementId
          ),
          eq(
            settlementRequests.status,
            "pending"
          )
        )
      )
      .limit(1);


    if(request){
      return NextResponse.json(
        {
          message:"已经申请过"
        },
        {
          status:400
        }
      );
    }

    // 创建申请
    const [newRequest] = await db
      .insert(settlementRequests)
      .values({

        settlementId,
        userId:user.id,
        status:"pending"

      })
      .returning();

    return NextResponse.json(
      {
        message:"申请成功",
        request:newRequest
      },
      {
        status:201
      }
    );

  }catch(error){

    console.error(
      "join settlement error:",
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