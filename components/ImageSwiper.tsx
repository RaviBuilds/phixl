"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import oldImg1 from "@/public/old-img1.jpg";
import oldImg2 from "@/public/old-img2.jpg";
import oldImg3 from "@/public/old-img3.jpg";
import oldImg4 from "@/public/old-img4.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageSwiper() {
  return (
    <Swiper
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      pagination={{
        clickable: true,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="mySwiper"
    >
      <SwiperSlide>
        <Image src={oldImg1} alt="OldImage" placeholder="blur" />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={oldImg2} alt="OldImage" placeholder="blur" />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={oldImg3} alt="OldImage" placeholder="blur" />
      </SwiperSlide>
      <SwiperSlide>
        <Image src={oldImg4} alt="OldImage" placeholder="blur" />
      </SwiperSlide>
    </Swiper>
  );
}
