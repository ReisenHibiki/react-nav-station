import { db } from "@/db"
import { cards } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function getCardDetail(card_id:number){
    const res = await db
    .select()
    .from(cards)
    .where(eq(cards.id, card_id))

    return res[0]
}