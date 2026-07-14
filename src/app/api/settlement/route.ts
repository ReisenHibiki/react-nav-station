import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { settlementMembers, settlements } from "@/db/schema";


export async function GET(){
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();


  if(!user){
    return NextResponse.json(
      {
        error:"Unauthorized"
      },
      {
        status:401
      }
    );
  }


  const result = await db
    .select({
      settlement:settlements,
      role:settlementMembers.role,
    })
    .from(settlementMembers)
    .innerJoin(
      settlements,
      eq(
        settlementMembers.settlementId,
        settlements.id
      )
    )
    .where(
      eq(
        settlementMembers.userId,
        user.id
      )
    )
    .limit(1);
  const membership=result[0];

    // 用户没有聚落则返回空
  if(!membership){
    return NextResponse.json({
      settlement:null
    });
  }

  return NextResponse.json({
    settlement:membership.settlement,
    role:membership.role
  });

}