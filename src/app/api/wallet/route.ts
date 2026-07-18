import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { wallets } from "@/db/schema";


export async function GET() {
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
    .select()
    .from(wallets)
    .where(
      eq(
        wallets.userId,
        user.id
      )
    )
    .limit(1);

  if(result.length===0){
    return NextResponse.json(
      {
        wallet:null
      }
    );
  }

  return NextResponse.json(
    {
      wallet:result[0]
    }
  );
}