'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import Link from 'next/link';

// icons
import BuildIcon from '@mui/icons-material/Build';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StoreIcon from '@mui/icons-material/Store';
import CloseIcon from '@mui/icons-material/Close';

type NavItem = {
  label: string,
  icon: string,
  type: "route" | "scroll",
  target: string,
}

const navItems: NavItem[] = [
  { label: "首页推荐", icon: "home", type: "scroll", target: "首页推荐" },
  { label: "教程百科", icon: "library", type: "scroll", target: "教程百科" },
  { label: "寻找聚落", icon: "village", type: "scroll", target: "寻找聚落" },
  { label: "实用工具", icon: "buildtool", type: "scroll", target: "实用工具" },
  { label: "皮肤站", icon: "awesome", type: "scroll", target: "皮肤站" },
  { label: "小鱼交易所", icon: "market", type: "route", target: "/market" },
]

const iconMap: Record<string, React.ReactNode> = {
  home: <AddHomeIcon style={{ fontSize: 22 }} />,
  library: <LibraryBooksIcon style={{ fontSize: 22 }} />,
  village: <HolidayVillageIcon style={{ fontSize: 22 }} />,
  awesome: <AutoAwesomeIcon style={{ fontSize: 22 }} />,
  buildtool: <BuildIcon style={{ fontSize: 22 }} />,
  market: <StoreIcon style={{ fontSize: 22 }}/>,
}
type Props = {
  onMenuClick: () => void;
};
export default function Navbar({onMenuClick}: Props) {
  const router = useRouter()
  const [active, setActive] = useState<string>("首页推荐")

  const handleClick = (item: NavItem) => {
    if (!item.target) return

    setActive(item.target)
    const target = item.target
    if (window.location.pathname !== "/") {
      router.push("/")
      setTimeout(() => {
        const element = document.getElementById(target)        
        element?.scrollIntoView({ behavior: "smooth" })
      }, 1000)
    } else {
        const element = document.getElementById(target)
        element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLink = (item: NavItem) => {
    if (!item.target) return
    setActive(item.target)
  }

  return (
    <div className="
      w-64 h-screen fixed
      bg-white/60 backdrop-blur-2xl
      border-r border-white/20
      shadow-lg
      select-none
      flex flex-col
    "
    style={{
      boxShadow: '0 0 40px rgba(0,0,0,0.05)',
    }}>
      {/* 装饰性光晕效果 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />

      <div className="p-5 flex flex-col gap-6 relative z-10">

        {/* 头部区域：Logo + 关闭按钮 */}
        <div onClick={()=>{setActive("首页推荐");onMenuClick()}} className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Image
                src="/face.png"
                alt="Logo"
                width={38}
                height={38}
                className="transition-transform group-hover:scale-105"
              />
              {/* Logo 光晕 */}
              <div className="absolute inset-0 blur-xl bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>

            <span className="font-bold text-lg tracking-wide bg-linear-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              傻鱼控制台
            </span>
          </Link>

          {/* 关闭按钮 - 只在移动端显示 */}
          <button
            onClick={onMenuClick}
            className="
              sm:hidden
              p-2
              rounded-lg
              hover:bg-red-100
              backdrop-blur-sm
              transition-all
              -mr-2
              hover:scale-105
              active:scale-95
            "
            aria-label="关闭菜单"
          >
            <CloseIcon style={{ fontSize: 24 }} className="text-slate-600" />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = active === item.target

            if (item.type === "scroll"){
              return (
                <div
                  key={item.label}
                  onClick={() => {handleClick(item); onMenuClick()}}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    cursor-pointer transition-all duration-300
                    hover:bg-white/40 hover:backdrop-blur-sm
                    hover:translate-x-1 hover:shadow-sm
                    relative select-none group
                    ${isActive ? "bg-white/50 backdrop-blur-sm shadow-sm font-semibold" : "hover:bg-white/30"}
                  `}
                >
                  {/* 左侧高亮条 */}
                  <div className={`
                    absolute left-0 top-1/2 -translate-y-1/2
                    w-1 h-6 rounded-full transition-all duration-300
                    ${isActive 
                      ? "bg-linear-to-b from-blue-500 to-blue-600 h-8" 
                      : "bg-transparent group-hover:bg-blue-200/50 group-hover:h-4"
                    }
                  `} />

                  {/* 图标容器 */}
                  <div className={`
                    transition-all duration-300
                    ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}
                  `}>
                    {iconMap[item.icon]}
                  </div>

                  <span className={`
                    text-lg transition-colors duration-300
                    ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}
                  `}>
                    {item.label}
                  </span>

                  {/* 激活状态指示点 */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
              )
            } else {
              // 非分区，跳转菜单
              return (
                <Link 
                  href={item.target} 
                  onClick={() => {handleLink(item); onMenuClick()}}
                  key={item.label}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    cursor-pointer transition-all duration-300
                    hover:bg-white/40 hover:backdrop-blur-sm
                    hover:translate-x-1 hover:shadow-sm
                    relative select-none group
                    ${isActive ? "bg-white/50 backdrop-blur-sm shadow-sm font-semibold" : "hover:bg-white/30"}
                  `}
                >
                  {/* 左侧高亮条 */}
                  <div className={`
                    absolute left-0 top-1/2 -translate-y-1/2
                    w-1 h-6 rounded-full transition-all duration-300
                    ${isActive 
                      ? "bg-linear-to-b from-blue-500 to-blue-600 h-8" 
                      : "bg-transparent group-hover:bg-blue-200/50 group-hover:h-4"
                    }
                  `} />

                  {/* 图标容器 */}
                  <div className={`
                    transition-all duration-300
                    ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}
                  `}>
                    {iconMap[item.icon]}
                  </div>

                  <span className={`
                    text-lg transition-colors duration-300
                    ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'}
                  `}>
                    {item.label}
                  </span>

                  {/* 激活状态指示点 */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </Link>
              )
            }
          })}
        </div>

        {/* 底部装饰 */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <div className="text-xs text-slate-400/60 text-center">
            v2.0.0
          </div>
        </div>

      </div>
    </div>
  )
}