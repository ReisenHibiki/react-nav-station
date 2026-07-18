import CardHeader from "./CardHeader";
import { ResourceCard } from "@/types/card";
import Advertisement from "@/components/Advertisement"
import Comment from "@/components/comment/Comment";

type Props = {
  card: ResourceCard;
};

export default function ResourceDetail({ card }: Props) {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10">
      <div className="w-full max-w-3xl px-6">

        <CardHeader card={card} >
            <div className="mt-5 select-none">
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 
                px-6 py-3 text-white font-medium hover:bg-blue-700 
                transition"
              >
                立即访问
              </a>
            </div>          
        </CardHeader>

        <Advertisement/>
        <Comment targetId={String(card.id)} targetType="settlement"/>

      </div>
    </div>
  );
}