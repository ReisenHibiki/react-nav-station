"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";

type Props = {
  isLogin?: boolean;
  username?: string;
  avatar?: string;
};

const Topnav = ({
  isLogin = false,
  username = "Henry",
  avatar = "",
}: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    // 清理函数，负责销毁时或再次触发useEffect时清理
    return () => {
    // 组件销毁时移除监听，避免内存泄漏
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="w-full h-14 border-b border-gray-200 bg-white flex items-center justify-between px-8">
      {/* Left */}
      <div className="text-sm text-gray-500 font-light">
        欢迎来到傻鱼导航站
      </div>

      {/* Right */}
      {isLogin ? (
        <div className="relative" ref={menuRef}>
            <div className="flex gap-1">
            <Avatar
              avatar={avatar}
              username={username}
            />            
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-gray-100 transition"
          >


            <span className="text-sm font-medium text-gray-700">
              {username}
            </span>

            <svg
              className={`w-4 h-4 text-gray-500 transition ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b">
                <div className="font-medium text-gray-800">
                  {username}
                </div>
                <div className="text-xs text-gray-500">
                  已登录
                </div>
              </div>

              <Link
                href="/profile"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                个人主页
              </Link>

              <button
                onClick={() => {
                  setOpen(false);

                  // TODO: Supabase SignOut
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <button className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition">
              登录
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-800 transition">
              注册
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Topnav;