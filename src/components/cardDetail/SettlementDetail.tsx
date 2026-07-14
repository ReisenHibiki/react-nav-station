import CardHeader from "./CardHeader";
import { SettlementCard } from "@/types/card";
import StatusIcon from "@/components/StatusIcon"

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


        <div className="mt-8 h-40 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-white">
          广告位
        </div>

      </div>
    </div>
  );
}