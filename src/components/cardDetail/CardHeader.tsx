'use client'
import { Card } from "@/types/card";
import Image from "next/image";
import { useState } from "react";

type Props = {
  card: Card;
  children?: React.ReactNode
};

const DEFAULT_ICON =
  "https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/iconBucket/missingIcon.webp";

export default function CardHeader({ card, children }: Props) {
  const [imgSrc, setImgSrc] = useState(card.icon || DEFAULT_ICON);

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-5">
          <Image
            src={
              imgSrc ??
              `https://www.google.com/s2/favicons?domain=${card.link}&sz=48`
            }
            alt={card.name}
            width={64}
            height={64}
            className="rounded-xl select-none"
            sizes="64px"
            onError={() => {
              if(imgSrc !== DEFAULT_ICON){
                setImgSrc(DEFAULT_ICON);
              }
            }}
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{card.name}</h1>

            <p className="text-gray-500 mt-1">{card.link}</p>
          </div>
        </div>

        <p className="text-gray-500 leading-8 mt-4">
          {card.description}
        </p>
        
        <div className="space-y-3">
            {children}
        </div>
        
      </div>
    </div>
  );
}