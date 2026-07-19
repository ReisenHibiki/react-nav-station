// 这是一个功能占位组件
// 用于告知用户该页面功能正在开发中，即将开放

import React from 'react';
import Head from 'next/head';

const ComingSoonPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>即将开放</title>
        <meta name="description" content="此功能正在开发中，即将开放，敬请期待" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="select-none min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6">
        <div className="w-full max-w-2xl mx-auto">
          {/* 卡片容器 — 毛玻璃效果 */}
          <div className="relative bg-white/60 backdrop-blur-xl backdrop-saturate-150 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-white/40 transition-all duration-300 hover:shadow-slate-300/40 hover:-translate-y-1">
            
            {/* 装饰光晕 */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl -z-10" />

            {/* 图标容器 */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-sm border border-white/70 shadow-lg flex items-center justify-center">
                <svg 
                  className="w-12 h-12 sm:w-14 sm:h-14 text-slate-700" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M12 13 L12 17 M12 13 L15 15 M12 13 L9 15" />
                </svg>
                {/* 小装饰点 */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse ring-2 ring-white/60" />
              </div>
            </div>

            {/* 标题区域 */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
                新功能即将开放
              </h1>
              <div className="w-16 h-1 bg-linear-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mt-3 mb-4" />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 text-sm font-medium text-slate-600">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                </span>
                完善中 · 敬请期待
              </div>
            </div>

            {/* 描述文字 */}
            <p className="text-center text-slate-600 text-base sm:text-lg leading-relaxed mt-5 max-w-md mx-auto">
              我们正在努力构建这个全新的页面体验。
              <br className="hidden sm:block" />
              它将为您带来更便捷、更智能的服务。
            </p>

            {/* 进度条区域 */}
            <div className="mt-7 max-w-sm mx-auto">
              <div className="relative w-full h-2.5 bg-white/40 rounded-full overflow-hidden border border-white/30 backdrop-blur-sm">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-linear-to-r from-blue-400 via-indigo-400 to-blue-400 bg-size-[200%_100%] animate-shimmer" 
                  style={{ width: '68%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5 px-0.5">
                <span>🚧 建设进度</span>
                <span className="font-mono">67.777%</span>
              </div>
            </div>

            {/* 占位按钮 */}
            <div className="mt-8 flex justify-center">
              <button 
                disabled 
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-slate-700 font-medium shadow-sm cursor-default transition-all duration-200 hover:bg-white/70 hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                感谢您的支持
              </button>
            </div>

            {/* 底部信息 */}
            <div className="mt-8 pt-6 border-t border-white/30 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                📅 预计 2026 Q4
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                🔔 请关注群内信息
              </span>
            </div>
          </div>

          {/* 页面底部微标 */}
          <div className="text-center mt-6 text-xs text-slate-400/60 tracking-wider">
            <span className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
              COMING SOON · 占位页面
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default ComingSoonPage;