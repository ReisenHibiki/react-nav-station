import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"


export async function GET(){
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error){
        return NextResponse.json(
            {error: error}, {status: 500}
        )
    }
    return NextResponse.json(
        {message: "退出成功"}, {status: 200}
    )
  
}


