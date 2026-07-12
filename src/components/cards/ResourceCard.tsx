import Link from "next/link";
import {ResourceCard as ResourceCardType} from "@/types/card"


type Props = {
  card: ResourceCardType;
};

export default function ResourceCard({ card }: Props) {
  return (
    <Link
      href={`/card/${card.id}`}
      className="h-32 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.8rem)]"
    >
      <div
        className="w-full h-full bg-white rounded-xl border border-slate-200
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-200
        flex items-center"
      >
        <div className="w-2/5 flex items-center justify-center">
          <img
            src={
              card.icon ??
              `https://www.google.com/s2/favicons?domain=${card.link}&sz=48`
            }
            alt={card.name}
            width={60}
            height={60}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col w-3/5 p-2">
          <p className="text-sm lg:text-base font-semibold line-clamp-1">
            {card.name}
          </p>

          <p className="text-xs lg:text-sm text-slate-500 line-clamp-2">
            {card.description}
          </p>
        </div>
      </div>
    </Link>
  );
}