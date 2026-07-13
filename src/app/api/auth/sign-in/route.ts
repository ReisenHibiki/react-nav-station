import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function POST(req: Request) {
  try{

  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      {error: "账号密码不能为空"}, {status: 400}
    )
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }

  // 利用onConflictDoNothing检查profile如不存在则新建
  await db.insert(profiles)
    .values({
      id: data.user.id,
      username: data.user.user_metadata.username,
    })
    .onConflictDoNothing();

  return NextResponse.json({
    success: true,
  },{status:200});

   }catch(err){
    console.error("login error:", err)
    return NextResponse.json(
      {
        error: "服务器错误",
        detail: err instanceof Error ? err.message : String(err)
      },
      {
        status: 500,
      }
    )

  } 
}