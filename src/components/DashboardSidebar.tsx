'use client'

import React from 'react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// icons
import PersonIcon from '@mui/icons-material/Person'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'

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
]

const iconMap: Record<string, React.ReactNode> = {
  profile: <PersonIcon style={{ fontSize: 22 }} />,
  settlement: <HolidayVillageIcon style={{ fontSize: 22 }} />,
}

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div
      className="
        w-64 h-screen fixed
        bg-white/80 backdrop-blur-xl
        border-r border-slate-200
        shadow-sm
      "
    >
      <div className="p-5 flex flex-col gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src="/face.png"
            alt="Logo"
            width={38}
            height={38}
          />

          <span className="font-bold text-lg tracking-wide">
            傻鱼控制台
          </span>
        </Link>

        {/* Menu */}
        <div className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3
                  px-3 py-2
                  rounded-lg
                  transition-all duration-200
                  hover:bg-slate-100
                  hover:translate-x-1
                  relative
                  ${
                    isActive
                      ? "bg-slate-100 font-semibold"
                      : ""
                  }
                `}
              >
                {/* 左侧高亮条 */}
                <div
                  className={`
                    absolute
                    left-0
                    top-2
                    bottom-2
                    w-1
                    rounded-full
                    transition-all
                    ${
                      isActive
                        ? "bg-blue-500"
                        : "bg-transparent"
                    }
                  `}
                />

                {iconMap[item.icon]}

                <span className="text-lg">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}