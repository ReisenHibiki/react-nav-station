"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";
import Loading from "@/components/Loading";

type SettlementRequest = {
  id: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  settlement: {
    id: number;
    cardId: number;
    name: string;
    icon: string | null;
    banner: string | null;
  };
};

type Settlement = {
  id: number;
  cardId: number;
  name: string;
  description: string | null;
  icon: string | null;
  banner: string | null;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function JoinSettlementPage() {
  const router = useRouter();

  const [request, setRequest] = useState<SettlementRequest | null>(null);
  const [keyword, setKeyword] = useState("");
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取当前申请
  async function getRequest() {
    const res = await fetch("/api/settlement/request");
    const data = await res.json();
    // console.log(data);
    // console.log("getRequest---console.log(data)");
    setRequest(data.request);
    setLoading(false)
  }

  // 页面初始化
  useEffect(() => {
    getRequest();
  }, []);

  // 搜索聚落
  async function search(page = 1) {
    if (!keyword.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/settlement/search?name=${encodeURIComponent(keyword)}&page=${page}&pageSize=12`
      );
      const data = await res.json();

      setSettlements(data.settlements);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  }

  // 撤回申请
  async function cancelRequest() {
    const res = await fetch("/api/settlement/request", {
      method: "DELETE"
    });

    if (res.ok) {
      setRequest(null);
    }
  }

  // 申请加入
  async function joinSettlement(settlementId: number) {
    setLoading(true)
    const res = await fetch(`/api/settlement/${settlementId}/request`, {
      method: "POST"
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      await getRequest();
    } else {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
            加入聚落
          </h1>
          <p className="mt-2 text-slate-500">提交加入申请，找到属于你的社区</p>
        </header>

        {/* 当前申请 */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-indigo-50/50 p-6 transition-all hover:shadow-indigo-200/50">
          <h2 className="select-none text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
            当前申请
          </h2>

          {loading ? <div className="bg-gray-300 h-12 w-full"></div> : request ? (
            <div className="flex items-center justify-between gap-4 bg-linear-to-r from-indigo-50/50 to-transparent p-4 rounded-xl">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {request.settlement.name}
                </h3>
                <p className="text-sm text-indigo-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  等待聚落管理员审核
                </p>
              </div>

              <button
                onClick={cancelRequest}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md shadow-red-200 hover:shadow-red-300"
              >
                撤回申请
              </button>
            </div>
          ) : (
            <div className="select-none text-slate-400 flex items-center gap-2 py-2">
              <GroupsIcon className="text-slate-300" />
              暂无加入申请
            </div>
          )
          }
        </section>

        {/* 搜索 */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-indigo-100/50 border border-indigo-50/50 p-6 transition-all hover:shadow-indigo-200/50">
          <div className="select-none flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-3.5 text-indigo-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    search();
                  }
                }}
                placeholder="搜索聚落名称..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400 transition-all duration-200 placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => search()}
              className="px-8 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-medium hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 active:scale-95"
            >
              搜索
            </button>
          </div>

          {/* 结果 */}
          {loading ? (
            <div className="py-10 text-center text-slate-400 flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              搜索中...
            </div>
          ) : settlements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5 mt-6">
              {settlements.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/card/${item.cardId}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-28 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 relative">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {item.description ?? "暂无介绍"}
                    </p>

                    <button
                      disabled={!!request}
                      onClick={(e) => {
                        e.stopPropagation();
                        joinSettlement(item.id);
                      }}
                      className={`
                        mt-5 w-full h-10 rounded-xl text-white font-medium transition-all duration-200
                        ${request
                          ? "bg-slate-300 cursor-not-allowed"
                          : "bg-linear-to-r from-slate-800 to-slate-700 hover:from-indigo-600 hover:to-indigo-500 shadow-md shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
                        }
                      `}
                    >
                      {request ? "已有申请" : "申请加入"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 flex flex-col items-center gap-3">
              <GroupsIcon className="text-6xl text-slate-300" />
              <p>暂无聚落，试试其他关键词</p>
            </div>
          )}
        </section>

        {/* 分页 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => search(index + 1)}
                className={`
                  min-w-10 h-10 px-3 rounded-lg font-medium transition-all duration-200
                  ${pagination.page === index + 1
                    ? "bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}