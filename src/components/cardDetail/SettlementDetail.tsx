import CardHeader from "@/components/cardDetail/CardHeader";
import { SettlementCard } from "@/types/card";
import StatusIcon from "@/components/StatusIcon"
import { MemberList } from "@/components/settlement/MemberList";
import Advertisement from "@/components/Advertisement"
import Comment from "@/components/comment/Comment";
import SettlementRule from "@/components/settlement/SettlementRule";

type Props = {
  card: SettlementCard;
};

export default function SettlementDetail({ card }: Props) {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl px-6">

        <CardHeader card={card}>
          <StatusIcon statusData={card.settlement.status}/>
          {card.settlement.rules ? <SettlementRule rules={card.settlement.rules}/> : ''}          
        </CardHeader>

        <div className="mt-6 w-full rounded-2xl shadow-md">
          <MemberList members={card.settlement.members} />          
        </div>

        <Advertisement/>
        <Comment targetId={String(card.id)} targetType="settlement"/>
      </div>
    </div>
  );
}