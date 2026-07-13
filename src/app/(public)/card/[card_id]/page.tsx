import React from 'react'
// import { useParams } from 'next/navigation'
import Link from 'next/link'
import getCardDetail from '@/lib/queries/cards'
import { CARD_TYPE } from "@/types/card";
import ResourceDetail from "@/components/cardDetail/ResourceDetail";
import SettlementDetail from "@/components/cardDetail/SettlementDetail";
import {Card} from "@/types/card"
type Props = {}

type Section = {
  title: string,
  sortOrder: number;
  cards: Card[],
}

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

    switch (cardData.type) {
        case CARD_TYPE.SETTLEMENT:
        return <SettlementDetail card={cardData} />;

        case CARD_TYPE.RESOURCE:
        default:
        return <ResourceDetail card={cardData} />;
    }
}
export default CardDetail