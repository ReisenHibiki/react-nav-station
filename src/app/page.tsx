'use client';
import Image from "next/image";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [search, setSearch] = useState("");

  return (
  <div className="min-h-screen w-full scroll-auto bg-black">
      {/* SearchBar 搜索栏*/}
      <div className="w-full h-72 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white">

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
    
</div>
  );
}
