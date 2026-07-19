'use client'

import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// icons
import PersonIcon from '@mui/icons-material/Person'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';

type NavItem = {
  label: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  {
    label: "个人资料",
    href: "/dashboard/profile",
    icon: "profile",
  },
  {
    label: "聚落管理",
    href: "/dashboard/settlement",
    icon: "settlement",
  },
  {
    label: "鲨鱼钱包",
    href: "/dashboard/wallet",
    icon: "wallet",
  },
    {
    label: "用户反馈",
    href: "/dashboard/feedback",
    icon: "feedback",
  },
]

const iconMap: Record<string, React.ReactNode> = {
  profile: <PersonIcon style={{ fontSize: 22 }} />,
  settlement: <HolidayVillageIcon style={{ fontSize: 22 }} />,
  wallet: <AccountBalanceWalletIcon style={{ fontSize: 22 }}/>,
  feedback: <FeedbackIcon style={{ fontSize: 22 }}/>
}

type Props = {
  onMenuClick?: () => void;
};

export default function DashboardSidebar({onMenuClick}: Props) {
  const pathname = usePathname()

  return (
    <div
      className="
        w-64 h-screen fixed
        bg-white/60 backdrop-blur-2xl
        border-r border-white/20
        shadow-lg
        select-none
        flex flex-col
      "
    >
      {/* 装饰性光晕效果 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />
      
      <div className="p-5 flex flex-col gap-6 relative z-10">

        {/* 头部区域：Logo + 关闭按钮 */}
        <div className="flex items-center justify-between">
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

        {/* Menu */}
        <div className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMenuClick}
                className={`
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-xl
                  transition-all duration-300
                  hover:bg-white/40
                  hover:backdrop-blur-sm
                  hover:translate-x-1
                  hover:shadow-sm
                  relative
                  group
                  ${
                    isActive
                      ? "bg-white/50 backdrop-blur-sm shadow-sm font-semibold"
                      : "hover:bg-white/30"
                  }
                `}
              >
                {/* 左侧高亮条 */}
                <div
                  className={`
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    w-1
                    h-6
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-linear-to-b from-blue-500 to-blue-600 h-8"
                        : "bg-transparent group-hover:bg-blue-200/50 group-hover:h-4"
                    }
                  `}
                />

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
          })}
        </div>

        {/* 底部装饰 */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <div className="text-xs text-slate-400/60 text-center">
            控制面板
          </div>
        </div>
      </div>
    </div>
  )
}