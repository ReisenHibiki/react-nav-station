"use client";

import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


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
  // 后端返回消息BackEnd Message
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const supabase = createClient()

  const { data: { publicUrl } } = supabase.storage
  .from('websiteBucket')
  .getPublicUrl(`websiteBg/momi.webp`)


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


  // 登录处理函数
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    const newErrors = {
      userId: "",
      email: "",
      password: "",
    };


    // 表单验证
    if (!form.userId || form.userId.length < 3) {
      newErrors.userId = "用户ID长度不得小于3";
    }


    if (!form.email.includes("@qq.com")) {
      newErrors.email = "请输入有效的QQ邮箱";
    }


    if (!/^[A-Za-z0-9!@#$%^&*]{8,}$/.test(form.password)) {
      newErrors.password = "密码至少8位，只能包含英文、数字和特殊字符";
    }


    setErrors(newErrors);

    // 验证不通过,
    if (
      !Object.values(newErrors)
        .every(error => error === "")
    ) {return}
      // 验证通过
      // 接口
      setLoading(true)
      try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.userId,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      // 判断请求是否失败
      if (res.ok) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }

      setMessage(data.message);

      setTimeout(() => {
        setMessage("");

        if (res.ok) {
          router.replace("/sign-in");
          setLoading(false)
        } else {setLoading(false)}
      }, 1500);

    } catch (error) {
      console.error(error)
      setSuccess(false)
      setMessage("请求错误");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setLoading(false)
    }
  };


  // render渲染部分
  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-gray-50
      px-4 select-none
      "
      style={{
      backgroundImage: `url(${publicUrl})`,
      }}
    >
      {/* 后端Message气泡代码 */}
            {
        message &&
        <div
          className={`
          fixed
          top-5
          right-5
          z-50
          rounded-lg
        ${success?"bg-green-400":"bg-red-400"}
          px-5
          py-3
          text-white
          shadow-lg
          `}
        >
          {message}
        </div>
      }
      {/* 气泡代码结束 */}
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
              updateField("userId", value.replace(/[^a-zA-Z0-9_]/g, ""))
            }
          />
          <AuthInput
            label="邮箱"
            placeholder="example@qq.com"
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
            disabled={loading}
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
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            {loading ? "注册中..." : "注册"}
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

      <Link href={'/'} className="flex justify-center hover:underline font-extralight mt-2">
        返回主页
      </Link>  

      <p className="text-center text-xs text-gray-300 mt-5">
        如果没有收到邮件，请检查垃圾箱
      </p> 

      </div>

    </main>
  );
}