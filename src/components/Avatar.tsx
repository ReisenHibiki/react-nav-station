'use client'
import React from "react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  avatar: string | null;
  username: string;
  className?: string;
};

const DEFAULT_ICON =
  "https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/iconBucket/missingIcon.webp";

const Avatar = ({
  avatar,
  username,
  className = "",
}: Props) => {
  if (avatar) {
    const [imgSrc, setImgSrc] = useState(avatar || DEFAULT_ICON);


    return (
      <Image
        src={imgSrc}
        alt="avatar"
        className={`w-9 h-9 object-cover cursor-default ${className}`}
        width={9}
        height={9}
        onError={() => {
          if(imgSrc !== DEFAULT_ICON){
            setImgSrc(DEFAULT_ICON);
          }
        }}
      />
    );
  }

  return (
    <div
      className={`w-9 h-9 rounded-full bg-sky-500 text-white cursor-default flex items-center justify-center font-semibold ${className}`}
    >
      {username[0].toUpperCase()}
    </div>
  );
};

export default Avatar;