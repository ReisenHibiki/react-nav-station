"use client";

import { Settlement } from "@/types/settlement";
import Avatar from "@/components/Avatar";
import StatusIcon from "@/components/StatusIcon";
import Link from "next/link";
import { MemberList } from "@/components/settlement/MemberList";
import SettlementRule from "@/components/settlement/SettlementRule";


type Props = {
  settlement: Settlement;
  role: "owner" | "member";
};


export default function SettlementDetail({ settlement, role }: Props) {

  async function handleLeave(){
    const confirmed =
      window.confirm(
        "确定退出聚落吗？"
      );
    if(!confirmed){
      return;
    }

    const res = await fetch(
      "/api/settlement",
      {
        method:"DELETE"
      }
    );

    const data = await res.json();
    if(!res.ok){
      alert(
        data.message
      );
      return;
    }
    window.location.reload();
  }



  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">

      {/* 聚落头部 */}
      <section className="bg-white rounded-2xl shadow-sm p-8">

        <div className="flex flex-col items-center text-center">

          {
            settlement.card.icon ? (
              <img
                src={settlement.card.icon}
                alt="settlement icon"
                className="w-24 h-24 rounded-full object-cover shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                无头像
              </div>
            )
          }

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            {settlement.card.name}
          </h1>

          <p className="mt-3 text-gray-500 max-w-md">
            {settlement.card.description || "暂无简介"}
          </p>

          <div className="mt-4">
            <StatusIcon
              statusData={
                settlement.status as "recruiting" | "active" | "afk"
              }
            />
          </div>

        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center gap-4">

          {
            role === "owner" && (
              <>
                <Link href={'/dashboard/settlement/edit'} className="
                  px-5 py-2.5 rounded-xl
                  bg-blue-500 text-white
                  hover:bg-blue-600
                  transition
                ">
                  修改聚落
                </Link>


                <Link href={'/dashboard/settlement/members'} className="
                  px-5 py-2.5 rounded-xl
                  bg-gray-100
                  hover:bg-gray-200
                  transition
                ">
                  管理成员
                </Link>
              </>
            )
          }
          <button onClick={handleLeave}
          className="
            px-5 py-2.5 rounded-xl
            bg-red-50 text-red-500
            hover:bg-red-100
            transition
          ">
            退出聚落
          </button>

        </div>

      </section>

      {/* 聚落信息 */}
      <section className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-5">
          聚落信息
        </h2>


        <div className="space-y-3 text-gray-600">

          <p>
            聚落 ID：
            <span className="text-gray-900">
              {settlement.id}
            </span>
          </p>

          <p>
            创建者：
            <span className="text-gray-900">
              {settlement.createdBy}
            </span>
          </p>

          <p>
            当前成员：
            <span className="text-gray-900">
              {settlement.members.length} 人
            </span>
          </p>

          {settlement.rules ? <SettlementRule rules={settlement.rules}/> : ''}
          

        </div>

      </section>
      {/* 成员列表 */}
      <MemberList members={settlement.members}/>
    </div>
  );
}