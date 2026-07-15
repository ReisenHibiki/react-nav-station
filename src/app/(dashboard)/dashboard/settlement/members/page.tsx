"use client";

import { useEffect, useState } from "react";
import { Member } from '@/types/settlement'
import { MemberList } from "@/components/settlement/MemberList";


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

    setLoading(true)
      const res = await fetch(`/api/settlement/members/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData();
      } else {
        setLoading(false)        
      }
  }

  // 审核申请
  async function handleRequest(id: number, action: "approve" | "reject") {
    setLoading(true)
    const res = await fetch(`/api/settlement/members/requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });

    if (res.ok) {
      loadData();
    } else {
      setLoading(false)
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
        <MemberList members={members} action={(member)=>{

          if(member.role === "owner"){
            return null;
          }

          return  <button
              onClick={()=>removeMember(member.id)}
              className="
              px-4 py-2
              bg-red-500
              text-white
              rounded-lg
              hover:bg-red-700
              cursor-pointer
              "
            >
              踢出
            </button>
        }
      } />

        {/* 加入申请 */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
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
                      className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600
                       text-white cursor-pointer"
                    >
                      同意
                    </button>

                    <button
                      onClick={() => handleRequest(request.id, "reject")}
                      className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-900
                       text-white cursor-pointer"
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