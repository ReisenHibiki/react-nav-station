"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import GroupsIcon from "@mui/icons-material/Groups";

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
  const [loading, setLoading] = useState(false);

  // 获取当前申请
  async function getRequest() {
    const res = await fetch("/api/settlement/request");
    const data = await res.json();
    console.log(data);
    console.log("getRequest---console.log(data)");
    setRequest(data.request);
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
    const res = await fetch(`/api/settlement/${settlementId}/request`, {
      method: "POST"
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      await getRequest();
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-800">加入聚落</h1>
          <p className="mt-2 text-slate-500">提交加入申请</p>
        </header>

        {/* 当前申请 */}
        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">当前申请</h2>

          {request ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {request.settlement.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  等待聚落管理员审核
                </p>
              </div>

              <button
                onClick={cancelRequest}
                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
              >
                撤回申请
              </button>
            </div>
          ) : (
            <div className="text-gray-400">暂无加入申请</div>
          )}
        </section>

        {/* 搜索 */}
        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-3 text-gray-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    search();
                  }
                }}
                placeholder="搜索聚落名称"
                className="w-full h-12 pl-12 rounded-xl bg-slate-100 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={() => search()}
              className="px-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              搜索
            </button>
          </div>

          {/* 结果 */}
          {loading ? (
            <div className="py-10 text-center text-gray-400">搜索中...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 mt-6">
              {settlements.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/card/${item.cardId}`)}
                  className="cursor-pointer bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition"
                >
                  <div className="h-28 bg-linear-to-r from-blue-400 to-indigo-500" />

                  <div className="p-5">
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {item.description ?? "暂无介绍"}
                    </p>

                    <button
                      disabled={!!request}
                      onClick={(e) => {
                        e.stopPropagation();
                        joinSettlement(item.id);
                      }}
                      className={`
                        mt-5 w-full h-10 rounded-xl text-white transition
                        ${request
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-slate-900 hover:bg-blue-600"
                        }
                      `}
                    >
                      {request ? "已有申请" : "申请加入"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 分页 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-4">
            {Array.from({ length: pagination.totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => search(index + 1)}
                className={`
                  px-4 py-2 rounded-lg
                  ${pagination.page === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
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