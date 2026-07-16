"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

type Props = {
};

const Topnav = ({}: Props) => {
  // useState
  const [open, setOpen] = useState(false);
  const [isLogin, setIslogin] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null);

    // 登出退出登录处理
  const handleSignOut = async ()=>{
    try {
          setIsLoading(true)      
      const res = await fetch('/api/auth/sign-out')
      if(res.ok){
          setIslogin(false)
          router.replace("/");
          router.refresh();
          return;
      }
    } finally{
        setIsLoading(false)   
    }

  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    // 安装监听
    document.addEventListener("mousedown", handleClickOutside);
    // 接口检查是否登录
    const checkLogin = async()=>{
      try{
        const res = await fetch('/api/profile')
        if(!res.ok){
          setIslogin(false)
          return;
        }
        // 已登录
        const profile = await res.json();
        setUsername(profile.username)
        if (profile.avatar){setAvatar(profile.avatar)} 
        setIslogin(true)
      } catch {
        setIslogin(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkLogin()

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
    <header className="w-full h-14 border-b border-gray-200 bg-white 
    flex items-center justify-between px-8 select-none">
      {/* Left */}
      <div className="text-sm text-gray-500 font-light">
        欢迎来到傻鱼导航站
      </div>

      {/* Right右侧用户小菜单 */}
      {isLoading ? <Loading /> : 
      // 结束Loading时
      isLogin ? (
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
                href="/dashboard/profile"
                className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                个人主页
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
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