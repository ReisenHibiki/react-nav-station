import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // 返回成功response
  return NextResponse.json({
    success: true,
    user: data.user,
  },{status:200});

   }catch{
    return NextResponse.json(
      {
        error: "服务器错误"
      },
      {
        status: 500,
      }
    )

  } 
}