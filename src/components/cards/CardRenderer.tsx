import ResourceCard from "@/components/cards/ResourceCard";
import SettlementCard from "@/components/cards/SettlementCard";
import {Card, CARD_TYPE} from "@/types/card"

type Props = {
  card: Card;
};

export default function CardRenderer({ card }: Props) {
  switch (card.type) {
    case CARD_TYPE.SETTLEMENT:
      return <SettlementCard card={card} />;

    case CARD_TYPE.RESOURCE:
    default:
      return <ResourceCard card={card} />;
  }
}