"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    // 验证密码
    if (!password.trim()) {
      setMessage("请输入新密码");
      setIsSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage("密码长度至少为 6 位");
      setIsSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("两次输入的密码不一致");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
      return;
    }

    setMessage("✓ 密码修改成功");
    setIsSuccess(true);
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="select-none min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md">
        {/* 返回链接 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-5"
        >
          <span>←</span> 返回首页
        </Link>

        {/* 主卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-100/60 p-8 border border-white/50">
          {/* 装饰图标 - 纯 CSS */}
          <div className="w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
            <span className="text-2xl text-white">🔒</span>
          </div>

          {/* 标题区 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 tracking-tight">
            修改密码
          </h1>
          <p className="text-sm text-gray-400 text-center mt-2 leading-relaxed">
            设置一个新的登录密码，
            <br />
            至少 6 位字符
          </p>

          {/* 分割线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
          </div>

          {/* 表单 */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                新密码
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                  ●
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入新密码"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                    bg-gray-50/50 focus:bg-white focus:border-emerald-400 
                    focus:ring-4 focus:ring-emerald-100 
                    transition-all duration-200 outline-none 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder:text-gray-300 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                确认新密码
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                  ✓
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 
                    bg-gray-50/50 focus:bg-white focus:border-emerald-400 
                    focus:ring-4 focus:ring-emerald-100 
                    transition-all duration-200 outline-none 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    placeholder:text-gray-300 text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 
                hover:from-emerald-600 hover:to-teal-600 
                active:scale-[0.98] transition-all duration-200 
                font-medium text-white text-sm tracking-wide
                disabled:opacity-50 disabled:active:scale-100
                shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  修改中...
                </span>
              ) : (
                "确认修改"
              )}
            </button>
          </form>

          {/* 密码强度提示 */}
          {password && password.length > 0 && password.length < 6 && (
            <div className="mt-3 text-xs text-amber-500 flex items-center gap-1.5">
              <span>⚠</span> 密码至少需要 6 位字符
            </div>
          )}

          {password && password.length >= 6 && (
            <div className="mt-3 text-xs text-emerald-500 flex items-center gap-1.5">
              <span>✓</span> 密码强度合格
            </div>
          )}

          {/* 消息提示 */}
          {message && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-sm text-center transition-all ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-500 border border-rose-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* 底部安全提示 */}
        <p className="text-center text-xs text-gray-300 mt-5">
          修改后请使用新密码重新登录
        </p>
      </div>
    </div>
  );
}