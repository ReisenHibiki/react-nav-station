"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const trimEmail = email.trim();

    if (!trimEmail) {
      setMessage("请输入邮箱地址");
      setIsSuccess(false);
      return;
    }

    // QQ邮箱验证
    if (!trimEmail.endsWith("@qq.com")) {
      setMessage("目前仅支持 QQ 邮箱");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
      return;
    }

    setMessage("✓ 重置密码邮件已发送，请检查邮箱");
    setIsSuccess(true);
  }

  return (
    <div className="select-none min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* 返回链接 */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-5"
        >
          <span>←</span> 返回登录
        </Link>

        {/* 主卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100/60 p-8 border border-white/50">
          {/* 装饰图标 - 纯 CSS */}
          <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200/50">
            <span className="text-2xl text-white">✉</span>
          </div>

          {/* 标题区 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 tracking-tight">
            重置密码
          </h1>
          <p className="text-sm text-gray-400 text-center mt-2 leading-relaxed">
            输入你注册时使用的邮箱地址，
            <br />
            我们将发送密码重置链接
          </p>

          {/* 分割线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
          </div>

          {/* 表单 */}
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                邮箱地址
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入你的邮箱"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                    bg-gray-50/50 focus:bg-white focus:border-indigo-400 
                    focus:ring-4 focus:ring-indigo-100 
                    transition-all duration-200 outline-none 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder:text-gray-300 text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 
                hover:from-indigo-600 hover:to-purple-600 
                active:scale-[0.98] transition-all duration-200 
                font-medium text-white text-sm tracking-wide
                disabled:opacity-50 disabled:active:scale-100
                shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  发送中...
                </span>
              ) : (
                "发送重置链接"
              )}
            </button>
          </form>

          {/* 消息提示 */}
          {message && (
            <div
              className={`mt-5 p-3.5 rounded-xl text-sm text-center transition-all ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-500 border border-rose-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>
        
        <p className="text-center text-xs text-gray-300 mt-5">
          如果没有收到邮件，请检查垃圾箱
        </p>
      </div>
    </div>
  );
}