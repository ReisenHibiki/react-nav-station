import React from 'react'
// import { useParams } from 'next/navigation'
import Link from 'next/link'
import getCardDetail from '@/lib/queries/cards'

type Props = {}

type Section = {
  title: string,
  sortOrder: number;
  cards: Card[],
}
type Card = {
  id: number;
  createdAt: Date;
  name: string;
  description: string | null;
  icon: string | null;
  link: string;
  sectionId: number;
  featuredOrder: number | null;
};

const CardDetail = async({
  params,
}: {
  params: Promise<{ card_id: number }>
}) => {
    // const params = useParams()
    const data = await params
    const card_id = data.card_id
    const cardData = await getCardDetail(card_id)
    
    // 404 handler
    if(!cardData){
        return <div className='w-full min-h-screen flex flex-col justify-center items-center font-bold'>
        <p>404 Not Found</p>
        <Link
          href="/"
          className="mt-3 bg-green-300 rounded-2xl p-3 hover:bg-green-600 active:scale-95
          transition-all duration-200 cursor-pointer"
        >
          Home
        </Link>
        </div>
                
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10">
        <div className="w-full max-w-3xl px-6">

            {/* 上面的card卡片 */}
            <div className="bg-white rounded-2xl shadow-md p-8">

            {/* 网站信息 Info */}
            <div className="flex items-center gap-5">
                <img
                src={
                    cardData.icon ??
                    `https://www.google.com/s2/favicons?domain=${cardData.link}&sz=48`
                }
                alt={cardData.name}
                width={64}
                height={64}
                className="rounded-xl"
                />

                <div>
                <h1 className="text-3xl font-bold">
                    {cardData.name}
                </h1>

                <p className="text-gray-500 mt-1">
                    {cardData.link}
                </p>
                </div>
            </div>

            {/* 按钮 Button */}
            <div className="mt-8">
                <a
                href={cardData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-3
                    text-white
                    font-medium
                    hover:bg-blue-700
                    transition
                "
                >
                立即访问
                </a>
            </div>

            {/* 描述 */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">
                网站介绍
                </h2>

                <p className="text-gray-600 leading-8">
                {cardData.description}
                </p>
            </div>
            </div>

            {/* AD 广告位 */}
            <div className="
            mt-8
            h-40
            rounded-2xl
            border-2
            border-dashed
            border-gray-300
            flex
            items-center
            justify-center
            text-gray-400
            bg-white
            ">
            广告位
            </div>

        </div>
        </div>
    )
}
export default CardDetail