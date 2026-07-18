'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";


export default function Banner(){

  return (
    <Swiper
      modules={[Autoplay]}
      loop
      autoplay={{
        delay:3000,
        disableOnInteraction:false,
      }}
      className="w-full h-full"
    >

      <SwiperSlide>
        <img
          className="w-full h-full object-cover"
          src="https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/bannerBucket/websiteBanner/banner_1.webp"
          alt=""
        />
      </SwiperSlide>


      <SwiperSlide>
        <img
          className="w-full h-full object-cover"
          src="https://xvbzfiqmzmhyzpmmpybh.supabase.co/storage/v1/object/public/bannerBucket/websiteBanner/banner_2.webp"
          alt=""
        />
      </SwiperSlide>

    </Swiper>
  )
}