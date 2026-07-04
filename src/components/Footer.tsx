export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* top part上半部分 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* 左侧品牌 */}
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-slate-800">
              傻鱼导航站
            </span>
            <span className="text-sm text-slate-500">
              一个傻傻的鱼
            </span>
          </div>

            {/* 右侧按钮TODO：晚点将按钮连接到具体页面 */}
          <div className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900 transition">
              关于
            </a>
            <a href="#" className="hover:text-slate-900 transition">
              反馈
            </a>
            <a href="#" className="hover:text-slate-900 transition">
              GitHub
            </a>
          </div>
        </div>

        {/* bottom part下半部分 */}
        <div className="text-xs text-slate-400 leading-relaxed">
          © {new Date().getFullYear()} 傻鱼导航站. All rights reserved.
        </div>

      </div>
    </footer>
  );
}