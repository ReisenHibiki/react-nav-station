"use client";

import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client"


export default function SignUpPage() {

  const [form, setForm] = useState({
    userId: "",
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({
    userId: "",
    email: "",
    password: "",
  });



  // 更新表单数据
  const updateField = (
    key: keyof typeof form,
    value: string
  ) => {

    setForm({
      ...form,
      [key]: value,
    });


    // 输入后清除当前错误
    setErrors({
      ...errors,
      [key]: "",
    });
  };



  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    const newErrors = {
      userId: "",
      email: "",
      password: "",
    };


    // 表单验证
    if (!form.userId) {
      newErrors.userId = "请输入用户ID";
    }


    if (!form.email.includes("@")) {
      newErrors.email = "请输入正确邮箱";
    }


    if (form.password.length < 6) {
      newErrors.password = "密码至少6位";
    }


    setErrors(newErrors);

    // 验证通过
    if (
      Object.values(newErrors)
        .every(error => error === "")
    ) {

      console.log("注册数据:", form);

      // Supabase
      const supabase = createClient()
      async function HandleSignUp() {
        const {data, error} = await supabase.auth.signUp({
          email: form.email,
          password: form.password
        })
        console.log(data)
        console.log("******")
        console.log(error)
      }
      HandleSignUp()
    }

  };

  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-gray-50
      px-4
      "
    >

      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-8
        shadow-xl
        "
      >

        {/* 标题 */}
        <div className="mb-8 text-center">

          <h1
            className="
            text-2xl
            font-bold
            text-gray-900
            "
          >
            创建账号
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-gray-500
            "
          >
            注册账号开始你的旅程
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <AuthInput
            label="游戏ID"
            placeholder="请输入正版游戏ID"
            value={form.userId}
            error={errors.userId}
            onChangeFather={(value) =>
              updateField("userId", value)
            }
          />
          <AuthInput
            label="邮箱"
            placeholder="example@email.com"
            value={form.email}
            error={errors.email}
            onChangeFather={(value) =>
              updateField("email", value)
            }
          />
          <AuthInput
            label="密码"
            placeholder="请输入密码"
            type="password"
            value={form.password}
            error={errors.password}
            onChangeFather={(value) =>
              updateField("password", value)
            }
          />

          <button
            type="submit"
            className="
            w-full
            rounded-xl
            bg-black
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            active:scale-[0.98]
            "
          >
            注册
          </button>

        </form>

        <p
          className="
          mt-6
          text-center
          text-sm
          text-gray-500
          "
        >
          已有账号？
          <Link href={"/sign-in"}
            className="
            ml-1
            cursor-pointer
            font-medium
            text-black
            hover:underline
            "
          >
            登录
          </Link>
        </p>

      </div>

    </main>
  );
}