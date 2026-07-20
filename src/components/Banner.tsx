'use client';

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { createClient } from "@/lib/supabase/client";


export default function Banner(){
  const [images, setImages] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchImages()
  }, [])

  // 从websiteBucket/websiteBanner获取所有图片
  const fetchImages = async () => {
      try {
        // 返回的是数组
        const { data: files, error } = await supabase.storage
          .from('websiteBucket')
          .list('websiteBanner')

        console.log("files =", files);

        // 检查
        if (error) {
          console.error('获取失败:', error)
          return
        }
        if (!files || files.length === 0) {
          console.log('没有找到文件')
          setImages([])
          return
        }

        // 遍历数组获取PublicUrl
        const imageUrls = files.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('websiteBucket')
            .getPublicUrl(`websiteBanner/${file.name}`)
          
          return publicUrl
        })

        console.log('生成的图片 URLs:', imageUrls)
        setImages(imageUrls)

      } catch (error) {
        console.error('错误:', error)
      }
    }


  return (
    <Swiper
      modules={[Autoplay]}
      loop={images.length >= 2}
      autoplay={{
        delay:3000,
        disableOnInteraction:false,
      }}
      className="w-full h-full"
    >
      {images.map((item)=>{
        return (
          <SwiperSlide>
            <img
              className="w-full h-full object-cover"
              src={`${item}`}
              alt=""
            />
          </SwiperSlide>          
        )
      })}

    </Swiper>
  )
}