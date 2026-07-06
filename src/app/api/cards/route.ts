// app/api/sections/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sections, cards } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(sections)
      .orderBy(asc(sections.sortOrder));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}