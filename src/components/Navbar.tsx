'use client'
import React from 'react'
import {useRouter} from 'next/navigation'
import SetMealIcon from '@mui/icons-material/SetMeal';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

type Props = {}
type NavItem={
  label: string,
  icon: string,
  type: "route" | "scroll",
  path?: string,
  target?: string,
}
type IconMap = {
  [key: string]: React.ReactNode;
};
const navItems: NavItem[] = [
  {label: "首页热门", icon: "home", type:"scroll", target: "首页热门"},
  {label: "教程百科", icon: "library", type:"scroll", target: "教程百科"},
  {label: "寻找聚落", icon: "village", type:"scroll", target: "寻找聚落"},
]
const iconMap: IconMap = {
  home: <AddHomeIcon />,
  fish: <SetMealIcon />,
  library: <LibraryBooksIcon />,
  village: <HolidayVillageIcon />,
};

const Navbar = (props: Props) => {
  const router = useRouter();
  const handleClick = (item: NavItem) => {
    const target = item.target;
    if (window.location.pathname === "/" && target) {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (target) {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }

  return (
    <div className="w-60 h-screen bg-slate-300
    flex flex-col items-center gap-4 fixed">

      <div className="mt-6 w-3/4 h-full flex flex-col gap-2">
        {/* LOGO */}
        <div className=" flex items-center gap-2">
          {iconMap.fish}
          <p className="font-bold text-xl ml-2">傻鱼导航站</p>
        </div>
        {/* MENU */}
        <div className="flex flex-col items-center gap-2 mt-4">
          {navItems.map((item, index) => (
            <div key={index} className="flex items-center 
            gap-2 p-2 hover:bg-slate-400 rounded cursor-pointer"
            onClick={() => handleClick(item)}>
              {iconMap[item.icon]}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>

  )
}

export default Navbar