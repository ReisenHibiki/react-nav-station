'use client'
import Link from "next/link";
import {
  SettlementCard as SettlementCardType,
  SETTLEMENT_STATUS,
} from "@/types/card";
import Image from "next/image";
import { useState } from "react";

type Props = {
  card: SettlementCardType;
};

const DEFAULT_ICON =
  "https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/iconBucket/missingIcon.webp";

const statusConfig = {
  [SETTLEMENT_STATUS.RECRUITING]: {
    text: "🟢 招募中",
    badge: "bg-green-100 text-green-700",
    border: "border-green-200",
    accent: "bg-green-500",
  },
  [SETTLEMENT_STATUS.ACTIVE]: {
    text: "🔵 活跃中",
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    accent: "bg-blue-500",
  },
  [SETTLEMENT_STATUS.AFK]: {
    text: "⚪ 暂停活动",
    badge: "bg-gray-100 text-gray-600",
    border: "border-gray-200",
    accent: "bg-gray-400",
  },
} as const;

export default function SettlementCard({ card }: Props) {
  const status =
    statusConfig[card.settlement.status] ?? statusConfig[SETTLEMENT_STATUS.ACTIVE];
  const [imgSrc, setImgSrc] = useState(card.icon || DEFAULT_ICON);
  const [errorMes, setErrorMes] = useState<string | null>(null)

  return (
    <Link
      href={`/card/${card.id}`}
      className="h-32 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.8rem)]"
    >
      <div
        className={`
          relative
          w-full h-full
          bg-white
          rounded-xl
          border
          ${status.border}
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-1
          transition-all duration-200
          flex items-center
          overflow-hidden
        `}
      >
        {/* 左侧装饰 */}
        <div
          className={`absolute left-0 top-0 h-full w-1 ${status.accent}`}
        />

        {/* 状态 */}
        <div
          className={`
            absolute
            top-3
            right-3
            rounded-full
            px-2
            py-0.5
            text-[11px]
            font-medium
            ${status.badge}
          `}
        >
          {status.text}
        </div>

        {/* Icon */}
        {<div className="w-2/5 flex items-center justify-center">
          <Image
            src={
              imgSrc ??
              "https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/iconBucket/missingIcon.webp"
            }
            alt={card.name}
            width={60}
            height={60}
            className="rounded-lg"
            sizes="60px"
            onError={() => {
              if(imgSrc !== DEFAULT_ICON){
                setImgSrc(DEFAULT_ICON);
                setErrorMes("该用户ID未找到头像,请联系管理员");
              }
            }}
          />
        </div>}

        {/* 内容 */}
        <div className="w-3/5 p-2 pr-4">
          <p className="text-sm lg:text-base font-semibold text-slate-800 line-clamp-1">
            {card.name}
          </p>

          <p className="mt-1 text-xs lg:text-sm text-slate-500 line-clamp-2">
            {card.description}
          </p>

          {errorMes ? <p className="mt-3 text-[10px] lg:text-[10px] text-slate-400 line-clamp-1">
            {errorMes}
          </p> : ''}
        </div>
      </div>
    </Link>
  );
}