import React from 'react'
import Image from "next/image";
import { SettlementCard } from "@/types/card";


type Props = {
    bannerUrl : string | null
    card: SettlementCard
}

const SettlementBanner = ({ card, bannerUrl }: Props) => {
  return (
    <div>
        {bannerUrl ? (
          <div className="relative group mt-4 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 select-none">
            <div className="relative w-full aspect-21/9">
              <Image
                src={bannerUrl}
                alt='聚落'
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* 底部渐变遮罩 - 显示聚落信息 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    {/* <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                      {card.name || '未命名聚落'}
                    </h2> */}
                    {/* {card.description && (
                      <p className="text-white/80 text-sm mt-1 drop-shadow line-clamp-1">
                        {card.description}
                      </p>
                    )} */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {new Date(card.settlement.updatedAt).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {card.settlement.members && (
                        <span className="text-white/60 text-xs flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                          {card.settlement.members.length} 位成员
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 状态标签 */}
                  {/* <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white text-sm font-medium">
                      {card.settlement.status || '活跃'}
                    </span>
                  </div> */}
                </div>
              </div>

              {/* 左上角装饰标签 */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <span className="text-white/80 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  聚落海报
                </span>
              </div>

              {/* 右上角操作提示 */}
              {/* <div onClick={() => window.open(bannerUrl, '_blank')} className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                查看大图
              </div> */}
            </div>
          </div>
        ) : (
          // 无banner时的占位
          <div className="relative mt-4 w-full aspect-21/9 rounded-2xl bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center border-2 border-dashed border-indigo-200">
            <div className="text-center">
              <div className="w-15 h-15 mx-auto bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
              </div>
              <p className="text-indigo-400 font-medium">暂无海报图</p>
              <p className="text-xs text-gray-400 mt-1">等待上传</p>
            </div>
          </div>
        )}
    </div>
  )
}

export default SettlementBanner