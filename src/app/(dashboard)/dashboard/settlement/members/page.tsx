"use client";

import { useEffect, useState } from "react";

type Member = {
  id: number;
  role: "owner" | "member";
  username: string;
  avatar: string | null;
  joinedAt: string | null;
};

type JoinRequest = {
  id: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    try {
      const [settlementRes, requestRes] = await Promise.all([
        fetch("/api/settlement"),
        fetch("/api/settlement/members/requests")
      ]);

      const settlementData = await settlementRes.json();
      const requestData = await requestRes.json();

      setMembers(settlementData.settlement?.members ?? []);
      setRequests(requestData.requests ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // 踢出成员
  async function removeMember(id: number) {
    const confirm = window.confirm("确定移除该成员吗？");
    if (!confirm) {
      return;
    }

    const res = await fetch(`/api/settlement/members/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      loadData();
    }
  }

  // 审核申请
  async function handleRequest(id: number, action: "approve" | "reject") {
    const res = await fetch(`/api/settlement/members/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });

    if (res.ok) {
      loadData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        加载中...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800">成员管理</h1>

        {/* 当前成员 */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-5">当前成员</h2>

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    {member.username[0]}
                  </div>

                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-gray-400">
                      {member.role === "owner" ? "聚落拥有者" : "成员"}
                    </p>
                  </div>
                </div>

                {member.role === "member" && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    踢出
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 加入申请 */}
        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-5">加入申请</h2>

          {requests.length === 0 ? (
            <div className="text-gray-400">暂无申请</div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{request.user.username}</p>
                    <p className="text-sm text-gray-400">
                      申请时间：{new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRequest(request.id, "approve")}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white"
                    >
                      同意
                    </button>

                    <button
                      onClick={() => handleRequest(request.id, "reject")}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-white"
                    >
                      拒绝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}