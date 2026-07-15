import Link from "next/link";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

export default function SettlementEmpty(){


  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* 提示文字 */}
      <div className="text-center space-y-2 mt-2">
        <h2 className="text-2xl font-bold text-slate-700">还没有聚落</h2>
        <p className="text-slate-400">创建一个新聚落或加入现有的聚落吧</p>
      </div>

      {/* 操作卡片 */}
      <div className="flex flex-col min-[800px]:flex-row gap-6">
        {/* 创建聚落 */}
        <Link
          href="/dashboard/settlement/create"
          className="
            group
            w-64 h-48
            bg-white
            rounded-2xl
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            border border-slate-100
            flex flex-col
            items-center
            justify-center
            gap-4
            transition-all
            duration-300
            hover:border-blue-200
          "
        >
          <div className="
            w-14 h-14
            rounded-full
            bg-blue-50
            group-hover:bg-blue-100
            flex items-center justify-center
            transition-colors
            duration-300
          ">
            <PlusOutlined className="text-3xl text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">创建聚落</p>
            <p className="text-sm text-slate-400">开启你的故事</p>
          </div>
        </Link>

        {/* 搜索加入 */}
        <Link
          href="/dashboard/settlement/join"
          className="
            group
            w-64 h-48
            bg-white
            rounded-2xl
            shadow-md
            hover:shadow-xl
            hover:-translate-y-1
            border border-slate-100
            flex flex-col
            items-center
            justify-center
            gap-4
            transition-all
            duration-300
            hover:border-indigo-200
          "
        >
          <div className="
            w-14 h-14
            rounded-full
            bg-indigo-50
            group-hover:bg-indigo-100
            flex items-center justify-center
            transition-colors
            duration-300
          ">
            <SearchOutlined className="text-3xl text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">搜索加入</p>
            <p className="text-sm text-slate-400">找到你的圈子</p>
          </div>
        </Link>


      </div>
    </div>
  );
}