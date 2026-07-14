import React from 'react'
import {
  SETTLEMENT_STATUS,
} from "@/types/card";

type Props = {
  statusData: (typeof SETTLEMENT_STATUS)[keyof typeof SETTLEMENT_STATUS];
};
const statusConfig = {
  [SETTLEMENT_STATUS.RECRUITING]: {
    text: "🟢 招募中",
    badge: "bg-green-100 text-green-700",
  },
  [SETTLEMENT_STATUS.ACTIVE]: {
    text: "🔵 活跃中",
    badge: "bg-blue-100 text-blue-700",
  },
  [SETTLEMENT_STATUS.AFK]: {
    text: "⚪ 暂停活动",
    badge: "bg-gray-100 text-gray-600",
  },
} as const;

const StatusIcon = ({ statusData }: Props) => {
  const status =
      statusConfig[statusData] ?? statusConfig[SETTLEMENT_STATUS.ACTIVE];
      
  return (
        <div
          className={`
            mt-1
            rounded-full
            px-3
            py-1
            text-[11px]
            font-medium
            ${status.badge}
          `}
        >
          {status.text}
        </div>
  )
}
export default StatusIcon