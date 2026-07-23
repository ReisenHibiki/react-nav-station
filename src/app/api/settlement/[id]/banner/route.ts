import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import sharp from "sharp";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { settlements } from "@/db/schema";

const ALLOW_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_SIZE = 1024 * 1024;

const BANNER_BUCKET = "settlement-banners";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // settlement id验证
    const { id } = await params;
    const settlementId = parseInt(id.trim(), 10);

    if (Number.isNaN(settlementId)) {
      return NextResponse.json(
        {
          message: "聚落不存在",
        },
        {
          status: 400,
        }
      );
    }


    // 登录
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "请先登录",
        },
        {
          status: 401,
        }
      );
    }

    // owner 权限验证
    const [settlement] = await db
      .select({
        id: settlements.id,
        createdBy: settlements.createdBy,
      })
      .from(settlements)
      .where(eq(settlements.id, settlementId))
      .limit(1);

    if (!settlement) {
      return NextResponse.json(
        {
          message: "聚落不存在",
        },
        {
          status: 404,
        }
      );
    }

    if (settlement.createdBy !== user.id) {
      return NextResponse.json(
        {
          message: "没有权限修改聚落海报",
        },
        {
          status: 403,
        }
      );
    }

    // FormData 图片检查验证
    const formData = await request.formData();

    const file = formData.get("banner");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "请选择图片",
        },
        {
          status: 400,
        }
      );
    }
    // 类型
    if (!ALLOW_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message: "仅支持 JPG、PNG、WEBP 图片",
        },
        {
          status: 400,
        }
      );
    }
    // 大小
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          message: "图片不能超过 1MB",
        },
        {
          status: 400,
        }
      );
    }
    // Sharp
    const originalBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const metadata = await sharp(originalBuffer).metadata();
      if (!metadata.format) {
        return NextResponse.json(
          {error:"Invalid image"},
          {status:400}
        );
    }

    const webpBuffer = await sharp(originalBuffer)
      .rotate()
      .resize({
        width: 1200,
        height: 675,
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toBuffer();

      console.log({
      input:file.size,
      output:webpBuffer.length})

    // Storage Path
    const storagePath =
      `${settlementId}/banner.webp`;

    // 上传
    const {
      error: uploadError,
    } = await supabase.storage
      .from(BANNER_BUCKET)
      .upload(
        storagePath,
        webpBuffer,
        {
          contentType: "image/webp",
          upsert: true,
        }
      );

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        {
          message: "上传图片失败",
        },
        {
          status: 500,
        }
      );
    }
    // 更新数据库
    // ----------------------------
    try {

      await db
        .update(settlements)
        .set({
          banner: storagePath,
        })
        .where(
          eq(
            settlements.id,
            settlementId
          )
        );

    } catch (dbError) {

      // 数据库失败
      // 删除已经上传的图片
      await supabase.storage
        .from(BANNER_BUCKET)
        .remove([
          storagePath,
        ]);

      console.error(dbError);

      return NextResponse.json(
        {
          message: "更新数据库失败",
        },
        {
          status: 500,
        }
      );

    }

    const { data:fileData } =
    await supabase.storage
    .from(BANNER_BUCKET)
    .download(storagePath);

    console.log(
    "uploaded size:",
    fileData?.size
    );

    // 成功返回
    return NextResponse.json({
      message: "上传成功",
      path: storagePath,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: "服务器内部错误",
      },
      {
        status: 500,
      }
    );
  }
}