import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { createClient } from "@/lib/supabase/server"


export async function POST(request: NextRequest) {

    const body = await request.json()
    const { username, email, password } = body;

try {

  // 校验
  if (username.length < 3) {
    return NextResponse.json(
      {
        message: "用户名不能小于3"
      },
      {
        status: 400
      }
    );
  }
    if (!email.includes("@qq.com")) {
    return NextResponse.json(
      {
        message: "请输入有效的QQ邮箱"
      },
      {
        status: 400
      }
    );
  }
      if (!/^[A-Za-z0-9!@#$%^&*]{8,}$/.test(password)) {
    return NextResponse.json(
      {
        message: "密码至少8位，只能包含英文、数字和特殊字符"
      },
      {
        status: 400
      }
    );
  }

    //验证完成
    console.log(username, password);
    // Supabase
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: password
    })
    if (error) {
        return NextResponse.json(
      {
        message: error.message
      },
      {
        status: 400
      })
    } else {
        return NextResponse.json(
      {
        message: "已发送邮件，请到邮箱确认",
        user:{
            username
        }
      },
      {
        status: 200
      })
    }


}catch (error) {
    console.log(error)
    return NextResponse.json(
      {error: "服务器内部错误，请稍后重试"},
      {status: 500}
    )
  }
}