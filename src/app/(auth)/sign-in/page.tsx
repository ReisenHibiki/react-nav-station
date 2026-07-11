"use client";
import { useState } from "react";
import AuthInput from "@/components/AuthInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm({
      ...form,
      [key]: value,
    });

    setErrors({
      ...errors,
      [key]: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    // 检查是否为空
    if (!form.email.trim()) {
      newErrors.email = "请输入邮箱";
    }

    if (!form.password.trim()) {
      newErrors.password = "请输入密码";
    }

    setErrors(newErrors);

    if (!Object.values(newErrors).every((error) => error === "")) {
      return;
    }
    //检查完成开始登录进程
    setLoading(true);

    try {
      const res = await fetch ("/api/auth/sign-in",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        })
      });

      const result = await res.json()

      // 登录失败
      if (!res.ok) {
        setSuccess(false);
        if(result.error === 'Invalid login credentials'){
            setMessage('账号或密码错误')          
        }else{
            setMessage(result.error) 
        }
        setTimeout(() => {
          setMessage("");
        }, 4000);

        return;
      }
      // 登录成功
      setSuccess(true);
      setMessage("登录成功，正在跳转...");

      setTimeout(() => {
        router.replace("/");
        router.refresh();
      }, 1000);

    } catch {
      setSuccess(false);
      setMessage("登录失败，请稍后重试");

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } finally {
      setLoading(false);
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
      {message && (
        <div
          className={`
          fixed
          top-5
          right-5
          z-50
          rounded-lg
          ${success ? "bg-green-400" : "bg-red-400"}
          px-5
          py-3
          text-white
          shadow-lg
          `}
        >
          {message}
        </div>
      )}

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
        <div className="mb-8 text-center">
          <h1
            className="
            text-2xl
            font-bold
            text-gray-900
            "
          >
            欢迎回来
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-gray-500
            "
          >
            登录账号继续你的旅程
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
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
            disabled:cursor-not-allowed
            disabled:bg-gray-400
            "
          >
            {loading ? "登录中..." : "登录"}
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
          还没有账号？
          <Link
            href="/sign-up"
            className="
            ml-1
            cursor-pointer
            font-medium
            text-black
            hover:underline
            "
          >
            注册
          </Link>
        </p>

        <Link
          href="/"
          className="
          mt-2
          flex
          justify-center
          font-extralight
          hover:underline
          "
        >
          返回主页
        </Link>
      </div>
    </main>
  );
}