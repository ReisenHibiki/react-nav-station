import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  cards,
  settlements,
  settlementMembers,
  profiles,
  settlementRequests,
  comments
} from "@/db/schema";

// 查询用户所在聚落的settlement,card,members GET
export async function GET(){
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();

  if(!user){
    return NextResponse.json(
      {
        error:"Unauthorized"
      },
      {
        status:401
      }
    );
  }
  // 查询settlement
  const result = await db
    .select({
      settlement:settlements,
      role:settlementMembers.role,
    })
    .from(settlementMembers)
    .innerJoin(
      settlements,
      eq(
        settlementMembers.settlementId,
        settlements.id
      )
    )
    .where(
      eq(
        settlementMembers.userId,
        user.id
      )
    )
    .limit(1);
  const membership=result[0];

    // 用户没有聚落则返回空
  if(!membership){
    return NextResponse.json({
      settlement:null
    });
  }
  // 查询cards
  const [card] = await db
    .select()
    .from(cards)
    .where(
    eq(
      cards.id,
      membership.settlement.cardId
    )
  )
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
      membership.settlement.id
    )
  )

  // 统一查询返回基础数据供组件使用
  return NextResponse.json({
    settlement:{
      ...membership.settlement,
      card,
      members
    },
    role:membership.role,
  });

}

// 创建聚落 POST
export async function POST(req: NextRequest) {

  try {
    // 获取当前登录用户
    const supabase = await createClient();

    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();


    if (!user) {
      return NextResponse.json(
        {
          message: "请先登录"
        },
        {
          status:401
        }
      );
    }


    const body = await req.json();
    const {
      name,
      description,
      rules,
      status,
      icon,
      link
    } = body;


    if(!name){
      return NextResponse.json(
        {
          message:"聚落名称不能为空"
        },
        {
          status:400
        }
      );
    }
    // 检查是否已经建立/加入聚落
    const [membership] = await db
      .select({
        id:settlementMembers.id
        })
      .from(settlementMembers)
      .where(
        eq(
          settlementMembers.userId,
          user.id
        )
      )
      .limit(1);
    if(membership){
      return NextResponse.json(
        {
          message:"已存在聚落，不能重复创建"
        },
        {
          status:400
        }
      );
    }
    
      // 检查是否有pending加入申请
    const [pendingRequest] = await db
    .select({
        id:settlementRequests.id
      })
    .from(settlementRequests)
    .where(
      and(
        eq(
          settlementRequests.userId,
          user.id
        ),
        eq(
          settlementRequests.status,
          "pending"
        )
      )
    )
    .limit(1);
  if(pendingRequest){
    return NextResponse.json(
      {
        message:"已有正在审核中的加入申请，不能创建聚落"
      },
      {
        status:400
      }
    );
  }

    // 获取用户profile
    const [profile] = await db
      .select({
        avatar: profiles.avatar
      })
      .from(profiles)
      .where(
        eq(
          profiles.id,
          user.id
        )
      );

    const result = await db.transaction(
      async(tx)=>{

        // 1. 创建 card
        const [card] = await tx
          .insert(cards)
          .values({

            name,
            description: description ?? null,
            icon: icon ?? profile.avatar,
            link: link ?? null,
            sectionId: 3,
            type:"settlement"
          })
          .returning();

        // 2. 创建 settlement

        const [settlement] = await tx
          .insert(settlements)
          .values({

            cardId:card.id,
            createdBy:user.id,
            rules: rules ?? null,
            status: status

          })
          .returning();


        // 3. 创建者成为 owner

        await tx
          .insert(settlementMembers)
          .values({

            settlementId:settlement.id,
            userId:user.id,
            role:"owner"

          });

        return {
          card,
          settlement
        };


      });

      return NextResponse.json(
        {
          message:"创建成功",
          data:result,
          settlementId: result.settlement.id,
        },
        {
          status:201
        }
      );

  }catch(error){

    console.error(
      "create settlement error:",
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


// 编辑聚落 PATCH
export async function PATCH(req: NextRequest) {

  try {
    const supabase = await createClient();
    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();

    if(!user){

      return NextResponse.json(
        {
          message:"请先登录"
        },
        {
          status:401
        }
      );

    }

    const body = await req.json();
    const {
      name,
      description,
      rules,
      status
    } = body;


    if(!name){
      return NextResponse.json(
        {
          message:"聚落名称不能为空"
        },
        {
          status:400
        }
      );

    }
    // 查询当前用户聚落身份
    const [membership] = await db
      .select({
        settlementId:settlementMembers.settlementId,
        role:settlementMembers.role
      })
      .from(settlementMembers)
      .where(
        eq(
          settlementMembers.userId,
          user.id
        )
      )
      .limit(1);

    if(!membership){

      return NextResponse.json(
        {
          message:"不存在聚落"
        },
        {
          status:404
        }
      );

    }

    // 权限检查
    if(membership.role !== "owner"){

      return NextResponse.json(
        {
          message:"没有权限修改聚落"
        },
        {
          status:403
        }
      );

    }

    // 查询对应card
    const [settlement] = await db
      .select({
        cardId:settlements.cardId
      })
      .from(settlements)
      .where(
        eq(
          settlements.id,
          membership.settlementId
        )
      )
      .limit(1);

    if(!settlement){

      return NextResponse.json(
        {
          message:"聚落不存在"
        },
        {
          status:404
        }
      );

    }

    // 更新两个表必须保持一致
    await db.transaction(
      async(tx)=>{

        // 更新card基础信息
        await tx
          .update(cards)
          .set({
            name,
            description:description ?? null
          })
          .where(
            eq(
              cards.id,
              settlement.cardId
            )
          );

        // 更新settlement扩展信息
        await tx
          .update(settlements)
          .set({

            rules:rules ?? null,

            status,

            updatedAt:new Date()

          })
          .where(
            eq(
              settlements.id,
              membership.settlementId
            )
          );


      }
    );

    return NextResponse.json(
      {
        message:"修改成功"
      }
    );

  }catch(error){
    console.error(
      "update settlement error:",
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


// DELETE 删除接口
export async function DELETE(){

  try{

    const supabase = await createClient();

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    if(!user){

      return NextResponse.json(
        {
          message:"请先登录"
        },
        {
          status:401
        }
      );

    }

    // 查询当前用户成员关系
    const [membership] = await db
      .select()
      .from(settlementMembers)
      .where(
        eq(
          settlementMembers.userId,
          user.id
        )
      )
      .limit(1);


    if(!membership){
      return NextResponse.json(
        {
          message:"你没有加入聚落"
        },
        {
          status:404
        }
      );
    }

    await db.transaction(
      async(tx)=>{
        // 查询当前聚落全部成员
        const members = await tx
          .select()
          .from(settlementMembers)
          .where(
            eq(
              settlementMembers.settlementId,
              membership.settlementId
            )
          );

        // 情况1:
        // 只有自己一个人
        // 删除card即可 cascade
        if(members.length === 1){
          const [settlement] = await tx
            .select({
              cardId:settlements.cardId
            })
            .from(settlements)
            .where(
              eq(
                settlements.id,
                membership.settlementId
              )
            )
            .limit(1);
          await tx
            .delete(cards)
            .where(
              eq(
                cards.id,
                settlement.cardId
              )
            );
            // 删除聚落时删除评论中targetId和卡片Id一致的row
          await tx
            .delete(comments)
            .where(
              and(
                eq(
                  comments.targetType,
                  "settlement"
                ),
                eq(
                  comments.targetId,
                  String(settlement.cardId)
                )
              )
            );
          return;
        }

        // 情况2:
        // 多人
        if(membership.role === "owner"){

          // 找加入时间最早的人
          const nextOwner = members
            .filter(
              item =>
                item.userId !== user.id
            )
            .sort(
              (a,b)=>
                a.joinedAt.getTime()
                -
                b.joinedAt.getTime()
            )[0];

          // 转移owner
          await tx
            .update(settlementMembers)
            .set({
              role:"owner"
            })
            .where(
              eq(
                settlementMembers.id,
                nextOwner.id
              )
            );
        }

        // 删除自己
        await tx
          .delete(settlementMembers)
          .where(
            eq(
              settlementMembers.userId,
              user.id
            )
          );


      }
    );

    return NextResponse.json({
      message:"退出成功"
    });

  }catch(error){
    console.error(
      "leave settlement error:",
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