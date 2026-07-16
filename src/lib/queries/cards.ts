import { db } from "@/db"
import { cards, settlements, settlementMembers, profiles } from "@/db/schema"
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

        // 查询成员
        const members = await db
        .select({
            id: settlementMembers.id,
            settlementId: settlementMembers.settlementId,
            userId: settlementMembers.userId,
            role: settlementMembers.role,
            joinedAt: settlementMembers.joinedAt,
            username: profiles.username,
            avatar: profiles.avatar
        })
        .from(settlementMembers)
        .innerJoin(profiles,eq( profiles.id, settlementMembers.userId))
        .where(
        eq(
            settlementMembers.settlementId,
            settlement.id
        )
        )
        const formattedMembers = members.map((member)=>{
            return{
                ...member,
                joinedAt: member.joinedAt.toISOString(),
            }
        })

        return {
            ...card,
            type: CARD_TYPE.SETTLEMENT,
            settlement:{
                ...settlement,
                members: formattedMembers
            }
        }
    }

    return {
    ...card,
    type: CARD_TYPE.RESOURCE,
    };
}