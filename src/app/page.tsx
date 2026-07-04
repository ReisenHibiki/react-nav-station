'use client';
import Image from "next/image";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

type Section = {
  title: string,
  cards: {
    id: number,
    name: string,
    description: string,
    imageUrl: string,
    link: string,    
  }[],
}

const sections: Section[] = [
  {
    title: "首页推荐",
    cards: [
      {
        id: 101,
        name: "MC百科",
        description: "模组百科站",
        imageUrl: "/images/mcmod.png",
        link: "https://www.mcmod.cn"
      },
      {
        id: 102,
        name: " Minecraft 官网",
        description: "Minecraft 官方网站",
        imageUrl: "/images/minecraft.png",
        link: "https://www.minecraft.net"
      }
    ]
  },
    {
    title: "教程百科",
    cards: [
      {
        id: 201,
        name: "MC百科",
        description: "模组百科站",
        imageUrl: "/images/mcmod.png",
        link: "https://www.mcmod.cn"
      },
      {
        id: 202,
        name: " Minecraft 官网",
        description: "Minecraft 官方网站",
        imageUrl: "/images/minecraft.png",
        link: "https://www.minecraft.net"
      }
    ]
  }
]



export default function Home() {
  const [search, setSearch] = useState("");

  return (
  <div className="min-h-screen w-full scroll-auto">
    {/* SearchBar 搜索栏*/}
      <div className="w-full h-72 flex flex-col items-center justify-center bg-linear-to-b from-slate-200 to-white">

      <span className="text-2xl font-light text-slate-700 mb-6">
        傻鱼导航站欢迎您
      </span>

      <div className="w-105 flex items-center bg-white 
        rounded-full shadow-md border border-slate-200
        px-4 py-2
        focus-within:ring-2 focus-within:ring-blue-400
        transition-all duration-200
        hover:shadow-lg">

        <input
          type="text"
          placeholder="请输入搜索内容..."
          className="flex-1 bg-transparent outline-none px-2 text-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="p-2 rounded-full bg-blue-500 text-white
          hover:bg-blue-600 active:scale-95
          transition-all duration-200"
          onClick={() => console.log(search)}
        >
          <SearchIcon />
        </button>
      </div>
    </div>
    
    {/* Sections 内容部分 */}
    <div>
      {sections.map((section: Section)=>(
        <div className="w-full flex flex-col gap-4 p-6" 
        key={section.title}
        id={section.title}>
          <p className="font-bold text-2xl ml-4 mt-2">{section.title}</p>

          {/* card 卡片部分 */}
          <div className="flex flex-wrap gap-4 cursor-pointer">
            {section.cards.map((card) => (
              <div className="h-32 w-full sm:w-1/2 lg:w-1/5" key={card.id}>
                
                <div className="w-full h-full bg-white rounded-xl border border-slate-200
                shadow-sm hover:shadow-lg hover:-translate-y-1
                transition-all duration-200
                flex items-center">
                <div className="w-2/5 flex items-center justify-center">
                  <img
                  src={`https://www.google.com/s2/favicons?domain=${card.link}&sz=48`}
                  alt={card.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-3/5 p-2">
                  <p className="text-sm lg:text-base font-semibold text-slate-800 line-clamp-1">{card.name}</p>
                  <p className="text-xs lg:text-sm text-slate-500 line-clamp-2">{card.description}</p>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>


    <div>

    </div>

</div>
  );
}
