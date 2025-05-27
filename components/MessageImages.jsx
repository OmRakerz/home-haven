"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MessageImages = ({ images, compact = false }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-28 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
        Нет изображений
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md w-full">
      {/* Слайдер */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        onSwiper={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        grabCursor={true}
        className="relative"
      >
        {/* Слайды */}
        <div className="flex overflow-hidden">
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={image}
                  alt={`Изображение ${index + 1}`}
                  width={compact ? 280 : 360}
                  height={compact ? 160 : 200}
                  className={`w-full object-cover ${compact ? "h-28" : "h-36"}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </div>

        {/* Кнопки навигации */}
        <button
          className={`custom-swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md ${
            isBeginning ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          disabled={isBeginning}
          aria-label="Предыдущее изображение"
        >
          <FaChevronLeft className="text-blue-500" />
        </button>

        <button
          className={`custom-swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md ${
            isEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          disabled={isEnd}
          aria-label="Следующее изображение"
        >
          <FaChevronRight className="text-blue-500" />
        </button>
      </Swiper>
    </div>
  );
};

export default MessageImages;
