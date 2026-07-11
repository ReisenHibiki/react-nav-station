import { NextResponse } from "next/server";
import { db } from "@/db";
import { createClient } from "@/lib/supabase/server";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(){
const supabase = await createClient();
const { data: { user },}  = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            {
                isLogin: false
            }, {status: 401}
        )
    } else {
        // 已登录
        const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        const profile = {...result[0]}

        return NextResponse.json(profile, {status:200})
    }
}