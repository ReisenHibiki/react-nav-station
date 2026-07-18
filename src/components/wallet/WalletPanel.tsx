"use client";

import { useEffect, useState } from "react";
import { Wallet, formatCoins } from "@/types/wallet";
import Skeleton from "@/components/Skeleton";

export default function WalletPanel() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchWallet() {
      try {
        const res = await fetch("/api/wallet");
        const data = await res.json();
        setWallet(data.wallet);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, []);

  function canCheckIn() {
    if (!wallet?.lastCheckIn) {
      return true;
    }

    const last = new Date(wallet.lastCheckIn);
    const now = new Date();

    return (
      last.getFullYear() !== now.getFullYear() ||
      last.getMonth() !== now.getMonth() ||
      last.getDate() !== now.getDate()
    );
  }

  async function handleCheckIn() {
    setChecking(true);
    setMessage("");

    const res = await fetch("/api/wallet/check-in", {
      method: "POST"
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      setChecking(false);
      return;
    }

    setWallet(data.wallet);
    setMessage("🎉 签到成功！");
    setChecking(false);

    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="m-4">
        <Skeleton />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="m-4 rounded-2xl border border-gray-200 p-6 bg-white/80 backdrop-blur-sm">
        <p className="text-center text-gray-500">钱包不存在</p>
      </div>
    );
  }

  return (
    <div className="m-4 sm:m-6 md:m-8 select-none">
      {/* 卡片容器 */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-px shadow-2xl">
        {/* 内部卡片 - 毛玻璃效果 */}
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl p-6 sm:p-8">
          {/* 装饰光晕 */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-linear-to-br from-purple-500/30 to-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-2xl"></div>

          {/* 内容 */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1m0 1v1m0 1v1m0 1v1" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    钱包
                  </h1>
                  <p className="text-xs text-white/50 font-medium tracking-widest">
                    WALLET
                  </p>
                </div>
              </div>

              <button
                disabled={!canCheckIn() || checking}
                onClick={handleCheckIn}
                className={`
                  relative px-5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-300
                  ${canCheckIn() && !checking
                    ? 'bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95'
                    : 'bg-white/10 text-white/30 cursor-not-allowed backdrop-blur-sm'
                  }
                `}
              >
                {checking ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    签到中
                  </span>
                ) : canCheckIn() ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    签到
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已签到
                  </span>
                )}
              </button>
            </div>

            {/* 消息提示 */}
            {message && (
              <div className={`
                mt-4 p-3 rounded-xl text-sm font-medium backdrop-blur-sm
                ${message.includes('成功') 
                  ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-200 border border-red-500/30'
                }
              `}>
                {message}
              </div>
            )}

            {/* 余额 */}
            <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-sm font-medium text-white/50 tracking-wider">
                Balance - 鱼鱼币
              </p>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-5xl font-bold text-white">
                  {formatCoins(wallet.balance)}
                </span>
                <span className="text-xl font-semibold text-white/40 mb-1">
                  Y
                </span>
              </div>
            </div>

            {/* 统计 */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-xs font-medium text-white/40 tracking-wider">
                  总收益
                </p>
                <p className="text-xl font-bold text-white mt-1">
                  {formatCoins(wallet.totalEarned)}
                  <span className="text-sm font-normal text-white/30 ml-1">Y</span>
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-xs font-medium text-white/40 tracking-wider">
                  状态
                </p>
                <p className="text-xl font-bold mt-1">
                  {canCheckIn() ? (
                    <span className="flex items-center gap-2 text-emerald-400">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      可签到
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-white/40">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已签到
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-white/30 font-mono tracking-wider">
                ✦ 当前每日签到奖励
              </span>
              <span className="text-xs text-white/30 font-mono">
                +200 Y
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}