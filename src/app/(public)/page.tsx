'use client';

import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FilterDrama, Handshake } from "@mui/icons-material";
import Link from "next/link";

type Section = {
  title: string,
  sortOrder: number;
  cards: Card[],
}
type Card = {
  id: number;
  createdAt: Date;
  name: string;
  description: string | null;
  icon: string | null;
  link: string;
  sectionId: number;
  featuredOrder: number | null;
};


export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Section[]>([]);
  // 原始数据
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(()=>{
    async function getCardData() {
      const res = await fetch("/api/cards")
      const data = await res.json()
      setSections(data)
      setData(data)
    }
    getCardData()
  }, [])

  const handleSearch = () => {
    let filteredData: Section[] = []
    for ( const section of sections) {
      // 如果没有包含搜索词就直接跳过该section不过滤
      if (!section.cards.some((card)=>(card.name.toLowerCase().includes(search.toLowerCase())))){
        continue        
      }

      const filteredCards = section.cards.filter((card)=>(card.name.toLowerCase().includes(search)))
      filteredData.push({
        ...section,
        cards: filteredCards
      })
      
    }
    // if (filteredData.length === 0){
    //   filteredData.push({title: "没有找到",cards: []})
    // }
    setData(filteredData)
  }

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />

        <button
          className="p-2 rounded-full bg-blue-500 text-white
          hover:bg-blue-600 active:scale-95
          transition-all duration-200"
          onClick={() => handleSearch()}
        >
          <SearchIcon />
        </button>
      </div>
    </div>
    
    {/* Sections 内容部分 */}
    <div className="bg-white">
      {data.map((section: Section)=>(
        <div className="w-full flex flex-col gap-4 p-6" 
        key={section.title}
        id={section.title}>
          <p className="font-bold text-2xl ml-4 mt-2">{section.title}</p>

          {/* card 卡片部分 */}
          <div className="flex flex-wrap gap-4 cursor-pointer">
            {section.cards.map((card) => (
              <Link href={`/card/${card.id}`} className="h-32 w-full sm:w-1/2 lg:w-1/5" key={card.id}>
                
                <div className="w-full h-full bg-white rounded-xl border border-slate-200
                shadow-sm hover:shadow-lg hover:-translate-y-1
                transition-all duration-200
                flex items-center">
                <div className="w-2/5 flex items-center justify-center">
                  <img
                  src={card.icon ?? `https://www.google.com/s2/favicons?domain=${card.link}&sz=48`}
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
              </Link>
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
