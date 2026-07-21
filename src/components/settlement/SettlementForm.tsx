"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SettlementFormData, Settlement } from "@/types/settlement";
import { SETTLEMENT_STATUS } from "@/types/card";
import BannerField from "./BannerField";
import { getStoragePublicUrl } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/client";

type Props = {
  mode: "create" | "edit";
  settlement?: Settlement;
  settlementId?: number;
};

export default function SettlementForm({
  mode,
  settlement,
  settlementId
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<SettlementFormData>({
    name: settlement?.card.name ?? "",
    description: settlement?.card.description ?? "",
    rules: settlement?.rules ?? "",
    status: (settlement?.status as SettlementFormData["status"]) ?? SETTLEMENT_STATUS.ACTIVE,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  function updateField<K extends keyof SettlementFormData>(
    key: K,
    value: SettlementFormData[K]
  ) {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("请输入聚落名称");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/settlement",
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "操作失败");
      }

      // 图片上传函数
      const currentSettlementId =
      mode==="create" ? data.settlementId : settlement!.id;

      await uploadBanner(
        currentSettlementId
      );

      router.replace("/dashboard/settlement");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // 图片上传部分状态
  const [bannerFile, setBannerFile] =
  useState<File | null>(null);
  // 图片Preview部分
  const supabase = createClient()

  const originalBanner = getStoragePublicUrl(supabase,"settlement-banners",settlement?.banner) ?? null;

  const [bannerPreview, setBannerPreview] =
    useState<string | null>(
      originalBanner
    );
  // 图片上传处理函数 - 接收组件参数并且告诉组件preview值
  function handleBannerChange(file: File) {
    // 如果当前预览是本地 blob，先释放
    if (bannerPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }
    
    const preview = URL.createObjectURL(file);
    setBannerFile(file);
    setBannerPreview(preview);
  }
  // 图片删除处理函数
  function handleBannerRemove() {
    if (
        bannerPreview?.startsWith("blob:")
    ) {
        URL.revokeObjectURL(
            bannerPreview
        );
    }
    setBannerFile(null);
    setBannerPreview(originalBanner);
  }
  // 上传图片函数
  async function uploadBanner(
      settlementId:number
  ){
      if(!bannerFile){
          return;
      }

      const formData = new FormData();

      formData.append(
          "banner",
          bannerFile
      );

      const res = await fetch(
          `/api/settlement/${settlementId}/banner`,
          {
              method:"POST",
              body:formData,
          }
      );

      const data = await res.json();

      if(!res.ok){
          throw new Error(
              data.message ??
              "上传海报失败"
          );
      }
  }

  // 状态标签配置
  const statusConfig = {
    [SETTLEMENT_STATUS.RECRUITING]: {
      label: "招新中",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      dot: "bg-emerald-500"
    },
    [SETTLEMENT_STATUS.ACTIVE]: {
      label: "活跃中",
      color: "text-blue-600",
      bg: "bg-blue-50",
      dot: "bg-blue-500"
    },
    [SETTLEMENT_STATUS.AFK]: {
      label: "暂停活动",
      color: "text-amber-600",
      bg: "bg-amber-50",
      dot: "bg-amber-500"
    }
  };

  return (
    <div className="flex justify-center items-center select-none">
    <div className="
      w-full max-w-xl
      bg-white
      rounded-3xl
      shadow-[0_8px_30px_rgb(0,0,0,0.06)]
      border border-gray-100/80
      p-8
      m-4
      transition-all
    ">
      <div className="mb-8">
        <h1 className="
          text-3xl
          font-bold
          bg-linear-to-r
          from-gray-900
          to-gray-700
          bg-clip-text
          text-transparent
        ">
          {mode === "create" ? "创建你的聚落" : "编辑聚落"}
        </h1>

        <p className="
          mt-2
          text-gray-400
          text-sm
          font-medium
        ">
          {mode === "create" 
            ? "建立一个属于您的卡片" 
            : "更新聚落信息"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 名称 */}
        <div>
          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            聚落名称
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            value={form.name}
            onChange={e => updateField("name", e.target.value)}
            placeholder="聚落名"
            className="
              w-full
              rounded-xl
              border border-gray-200
              px-4 py-3
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-gray-400
              focus:ring-4
              focus:ring-gray-100
              hover:border-gray-300
            "
          />
        </div>
        {/* 状态 - 自定义选择器 */}
        <div>
          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            聚落状态
          </label>

          <div className="relative">
            <select
              value={form.status}
              onChange={e =>
                updateField(
                  "status",
                  e.target.value as SettlementFormData["status"]
                )
              }
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                pr-12
                bg-white
                text-gray-900
                font-medium
                outline-none
                cursor-pointer
                appearance-none
                transition-all
                duration-200
                focus:border-gray-400
                focus:ring-4
                focus:ring-gray-100
                hover:border-gray-300
              "
            >
              {Object.entries(statusConfig).map(([value, config]) => (
                <option key={value} value={value} className="py-2">
                  {config.label}
                </option>
              ))}
            </select>

            {/* 自定义下拉箭头 */}
            <div className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              pointer-events-none
              text-gray-400
            ">
              <svg
                className="w-5 h-5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* 当前状态标签 */}
            <div className="
              absolute
              right-12
              top-1/2
              -translate-y-1/2
              pointer-events-none
            ">
              <span className={`
                inline-flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-full
                text-xs
                font-medium
                ${statusConfig[form.status as keyof typeof statusConfig]?.bg}
                ${statusConfig[form.status as keyof typeof statusConfig]?.color}
              `}>
                <span className={`
                  w-1.5
                  h-1.5
                  rounded-full
                  ${statusConfig[form.status as keyof typeof statusConfig]?.dot}
                `} />
                {statusConfig[form.status as keyof typeof statusConfig]?.label}
              </span>
            </div>
          </div>
        </div>
        {/* 简介 */}
        <div>
          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            聚落简介
            <span className="text-gray-400 text-xs font-normal ml-2">选填</span>
          </label>

          <textarea
            value={form.description}
            onChange={e => updateField("description", e.target.value)}
            rows={3}
            placeholder="介绍你的聚落风格、目标或特色"
            className="
              w-full
              rounded-xl
              border border-gray-200
              px-4 py-3
              resize-none
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-gray-400
              focus:ring-4
              focus:ring-gray-100
              hover:border-gray-300
            "
          />
        </div>

        {/* 规则 */}
        <div>
          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            聚落规则
            <span className="text-gray-400 text-xs font-normal ml-2">选填</span>
          </label>

          <textarea
            value={form.rules}
            onChange={e => updateField("rules", e.target.value)}
            rows={4}
            placeholder="例如：尊重成员，文明友善"
            className="
              w-full
              rounded-xl
              border border-gray-200
              px-4 py-3
              resize-none
              text-gray-900
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-gray-400
              focus:ring-4
              focus:ring-gray-100
              hover:border-gray-300
            "
          />
        </div>

        {/* 海报图片上传 */}
        <div>
          <label className="
            block
            text-sm
            font-semibold
            text-gray-700
            mb-2
          ">
            聚落海报
            <span className="text-gray-400 text-xs font-normal ml-2">选填</span>
          </label>
          
          <BannerField 
              preview={bannerPreview}
              disabled={loading}
              onChange={handleBannerChange}
              onRemove={handleBannerRemove}
          />
        </div>



        {error && (
          <div className="
            rounded-xl
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
            flex
            items-center
            gap-2
          ">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-linear-to-r
            from-gray-900
            to-gray-600
            py-3.5
            text-white
            font-semibold
            transition-all
            duration-200
            hover:shadow-lg
            hover:shadow-gray-200
            hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
            disabled:hover:shadow-none
          "
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              处理中...
            </span>
          ) : mode === "create" ? (
            "创建聚落"
          ) : (
            "保存修改"
          )}
        </button>
      </form>
    </div>
    </div>
  );
}