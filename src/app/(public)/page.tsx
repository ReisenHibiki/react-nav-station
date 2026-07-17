'use client';

import { useState, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import Link from "next/link";
import Loading from "@/components/Loading";
import {Card} from "@/types/card"
import CardRenderer from "@/components/cards/CardRenderer";

type Section = {
  title: string,
  sortOrder: number;
  cards: Card[],
}


export default function Home() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Section[]>([]);
  // 原始数据
  const [sections, setSections] = useState<Section[]>([]);
   const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    async function getCardData() {
      try{
        const res = await fetch("/api/cards")
        const data = await res.json()
        if (!res.ok) {
          throw new Error("获取数据失败");
        }
        setSections(data)
        setData(data)
        // 打印检查数据
        // console.log(data)

      } catch {
        setData([{title:"获取数据失败",sortOrder:0, cards: []}])
      } finally {
        setIsLoading(false)
      }
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
    if (filteredData.length === 0){
      filteredData.push({title: "没有搜索结果",cards: [],sortOrder:0})
    }
    setData(filteredData)
  }

  return (
  <div className="min-h-screen w-full scroll-auto bg-white select-none">
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
    {isLoading ? <Loading size='lg' /> : 
    <div className="bg-white">
      {data.map((section: Section)=>(
        <div className="w-full flex flex-col gap-4 p-6 select-none" 
        key={section.title}
        id={section.title}>
          <p className="font-bold text-2xl ml-4 mt-2">{section.title}</p>

          {/* card 卡片部分 */}
          <div className="flex flex-wrap gap-4 cursor-pointer">
            {/* 封装组件复用代码 */}
            {section.cards.map((card) => (
              <CardRenderer
                key={card.id}
                card={card}
              />
            ))}

          </div>
        </div>
      ))}
    </div>}


    <div>

    </div>

</div>
  );
}
