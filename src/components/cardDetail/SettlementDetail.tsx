import CardHeader from "./CardHeader";
import { SettlementCard } from "@/types/card";
import StatusIcon from "@/components/StatusIcon"
import { MemberList } from "../settlement/MemberList";
import Advertisement from "@/components/Advertisement"

type Props = {
  card: SettlementCard;
};

export default function SettlementDetail({ card }: Props) {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl px-6">

        <CardHeader card={card}>
          <StatusIcon statusData={card.settlement.status}/>
        </CardHeader>

        <div className="mt-6 w-full rounded-2xl shadow-md">
          <MemberList members={card.settlement.members} />          
        </div>

        <Advertisement/>

      </div>
    </div>
  );
}