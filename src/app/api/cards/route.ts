// app/api/sections/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sections, cards } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

type Section = {
  sectionID: number,
  title: string,
  sortOrder: number,
  cards: {
    id: number,
    name: string,
    description?: string | null,
    icon?: string | null,
    link: string,    
    featuredOrder?: number | null;
  }[],
}

export async function GET() {
  try {
    const rows = await db
    .select()
    .from(sections)
    .leftJoin(cards, eq(sections.id, cards.sectionId))
    .orderBy(asc(sections.sortOrder))

    const data = rows.reduce<Section[]>((acc: Section[], row)=>{
      let section = acc.find(item=>item.sectionID === row.sections.id)
      
      if (!section) {
        section = {
          sectionID: row.sections.id,
          title: row.sections.title,
          sortOrder: row.sections.sortOrder,
          cards: []
        }
        acc.push(section)

      }

      if(row.cards){
        section.cards.push(row.cards)
      }
      
      return acc
    }, [])

    // 推荐部分
    const featuredSection = data.find(
      section => section.sectionID === 1
    )
    if (featuredSection) {
      const featuredCards = data
        .flatMap(section => section.cards)
        .filter(card => card.featuredOrder != null)
        .sort((a, b) => a.featuredOrder! - b.featuredOrder!)

      featuredSection.cards.push(...featuredCards)
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {error: "Failed to fetch"},
      {status: 500}
    )
  }
}