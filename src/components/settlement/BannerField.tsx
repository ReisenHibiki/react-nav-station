"use client";

import Image from "next/image";

type Props = {
  preview: string | null;
  disabled?: boolean;
  onChange: (file: File) => void;
  onRemove: () => void;
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOW_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function BannerField({
  preview,
  disabled = false,
  onChange,
  onRemove,
}: Props) {

  function handleSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    // 保险一些
    if (disabled) {
        return;
    }

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // 类型检查
    if (!ALLOW_TYPES.includes(file.type)) {
      alert("仅支持 JPG、PNG、WEBP 图片");
      e.target.value = "";
      return;
    }

    // 大小检查
    if (file.size > MAX_SIZE) {
      alert("图片大小不能超过 5MB");
      e.target.value = "";
      return;
    }

    onChange(file);

    // 允许再次选择同一张图片
    e.target.value = "";
  }

  return (
    <div className="space-y-3">


      <div
        className="
          w-full
          aspect-video
          rounded-xl
          overflow-hidden
          border
          bg-gray-100
          flex
          items-center
          justify-center
        "
      >
        {
          preview ? (
            <Image
              src={preview}
              alt="Banner Preview"
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-gray-400 text-sm select-none">
              暂无海报
            </span>
          )
        }
      </div>

        <input
        id="banner-upload"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        disabled={disabled}
        className="hidden"
        />

        <div className="flex gap-3">
            <label
                htmlFor="banner-upload"
                className={`
                px-4 py-2 rounded-lg
                text-white
                transition
                ${
                    disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                }
                `}
            >
                {preview ? "更换图片" : "选择图片"}
            </label>

            {
                preview && (
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="
                    px-4 py-2
                    rounded-lg
                    border
                    border-red-300
                    text-red-500
                    hover:bg-red-50
                    disabled:opacity-50
                    "
                >
                    移除图片
                </button>
                )
            }
        </div>

        <p className="text-xs text-gray-500">
        支持 JPG、PNG、WEBP，最大 5MB
        </p>

    </div>
  );
}