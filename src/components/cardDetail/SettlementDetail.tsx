import CardHeader from "@/components/cardDetail/CardHeader";
import { SettlementCard } from "@/types/card";
import StatusIcon from "@/components/StatusIcon"
import { MemberList } from "@/components/settlement/MemberList";
import Advertisement from "@/components/Advertisement"
import Comment from "@/components/comment/Comment";
import SettlementRule from "@/components/settlement/SettlementRule";
import SettlementBanner from "@/components/settlement/SettlementBanner";
import { createClient } from "@/lib/supabase/server";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

type Props = {
  card: SettlementCard;
};

export default async function SettlementDetail({ card }: Props) {

  const supabase = await createClient()
  let bannerUrl: string | null = null
  if (card.settlement.banner) {
    bannerUrl = getStoragePublicUrl(
      supabase,
      "settlement-banners",
      card.settlement.banner,
      card.settlement.updatedAt
    );
  }
  
  
  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl px-6">

        <CardHeader card={card}>
          <StatusIcon statusData={card.settlement.status}/>
          {card.settlement.rules ? <SettlementRule rules={card.settlement.rules}/> : ''}          
        </CardHeader>

        <SettlementBanner card={card} bannerUrl={bannerUrl}/>

        <div className="mt-6 w-full rounded-2xl shadow-md">
          <MemberList members={card.settlement.members} />          
        </div>

        <Advertisement/>
        <Comment name="留言区" targetId={String(card.id)} targetType="settlement"/>
      </div>
    </div>
  );
}