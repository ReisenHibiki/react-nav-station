import { NextResponse } from "next/server";
import { eq, ilike, count } from "drizzle-orm";

import { db } from "@/db";
import {
  settlements,
  cards
} from "@/db/schema";


export async function GET(
  request: Request
){

  try{
    const { searchParams } =
      new URL(request.url);

    // 搜索关键词
    const name =
      searchParams.get("name");
    if(!name){
      return NextResponse.json(
        {
          message:"请输入聚落名称"
        },
        {
          status:400
        }
      );

    }

    // 当前页
    const page =
      Math.max(
        Number(searchParams.get("page")) || 1,
        1
      );

    // 每页数量
    const pageSize =
      Math.min(
        Number(searchParams.get("pageSize")) || 20,
        50
      );
    // offset计算
    const offset =
      (page - 1) * pageSize;


    /*
      查询数据
    */
    const result =
      await db
        .select({
          id:settlements.id,

          cardId:settlements.cardId,

          name:cards.name,

          description:cards.description,

          icon:cards.icon,

          banner:settlements.banner,

          createdAt:settlements.createdAt
        })
        .from(settlements)
        .innerJoin(
          cards,
          eq(
            settlements.cardId,
            cards.id
          )
        )
        .where(
          ilike(
            cards.name,
            `%${name}%`
          )
        )
        .limit(pageSize)
        .offset(offset);



    /*
      查询总数量
    */
    const [
      totalResult
    ] =
      await db
        .select({
          count:count()
        })
        .from(settlements)
        .innerJoin(
          cards,
          eq(
            settlements.cardId,
            cards.id
          )
        )
        .where(
          ilike(
            cards.name,
            `%${name}%`
          )
        );


    const total =
      Number(totalResult.count);


    const totalPages =
      Math.ceil(
        total / pageSize
      );



    return NextResponse.json({

      settlements:result,

      pagination:{
        page,
        pageSize,
        total,
        totalPages
      }

    });



  }catch(error){
    
    console.error(
      "search settlement error:",
      error
    );
    return NextResponse.json(
      {
        message:"服务器错误"
      },
      {
        status:500
      }
    );

  }

}