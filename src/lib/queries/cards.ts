import { db } from "@/db"
import { cards, settlements } from "@/db/schema"
import { eq } from "drizzle-orm"
import { CARD_TYPE, Card } from "@/types/card"

export default async function getCardDetail(card_id:number): Promise<Card | null>{
    const res = await db
    .select()
    .from(cards)
    .where(eq(cards.id, card_id))
    const card = res[0]
    if (!card) {
        return null;
    }

    if (card.type === CARD_TYPE.SETTLEMENT) {
        const res = await db
        .select()
        .from(settlements)
        .where(eq(settlements.cardId, card_id))
        const settlement = res[0]
        return {
            ...card,
            type: CARD_TYPE.SETTLEMENT,
            settlement: settlement
        }
    }

    return {
    ...card,
    type: CARD_TYPE.RESOURCE,
    };
}