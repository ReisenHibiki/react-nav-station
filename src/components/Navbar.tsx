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

export default function Navbar() {
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
      }, 300)
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
    <div className="w-64 h-screen fixed
      bg-white/80 backdrop-blur-xl 
      border-r border-slate-200
      shadow-sm">

      <div className="p-5 flex flex-col gap-6">

        {/* LOGO */}
        <Link href={"/"} className="flex items-center gap-3 cursor-pointer">
          <Image src="/face.png" alt="Logo" width={38} height={38} />
          <span className="font-bold text-lg tracking-wide">
            傻鱼导航站
          </span>
        </Link>

        {/* MENU */}
        <div className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = active === item.target

            if (item.type === "scroll"){
              return (
                <div
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    cursor-pointer transition-all duration-200
                    hover:bg-slate-100 hover:translate-x-1
                    relative select-none
                    ${isActive ? "bg-slate-100 font-semibold" : ""}
                  `}
                >
                  {/* 左侧高亮条 */}
                  <div className={`
                    absolute left-0 top-2 bottom-2 w-1 rounded-full
                    transition-all
                    ${isActive ? "bg-blue-500" : "bg-transparent"}
                  `} />

                    {iconMap[item.icon]}

                  <span className="text-lg">
                    {item.label}
                  </span>
                </div>
              )
            } else  {
              return (
                <Link href={item.target} onClick={() => {{handleLink(item)}}}
                  key={item.label}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    cursor-pointer transition-all duration-200
                    hover:bg-slate-100 hover:translate-x-1
                    relative select-none
                    ${isActive ? "bg-slate-100 font-semibold" : ""}
                  `}
                >
                  {/* 左侧高亮条 */}
                  <div className={`
                    absolute left-0 top-2 bottom-2 w-1 rounded-full
                    transition-all
                    ${isActive ? "bg-blue-500" : "bg-transparent"}
                  `} />

                    {iconMap[item.icon]}

                  <span className="text-lg">
                    {item.label}
                  </span>
                </Link>
              )
            }
          })}
        </div>

      </div>
    </div>
  )
}