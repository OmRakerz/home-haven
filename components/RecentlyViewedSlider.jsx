"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useState, useEffect } from "react";
import { Navigation } from "swiper/modules";
import Link from "next/link";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RecentlyViewedSlider = ({ items }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="recently-viewed-slider mt-4 relative">
      {/* Слайдер с навигацией */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => {
          // Установка начального состояния
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          // Обновление состояния при смене слайда
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        grabCursor={true} // показывает, что можно перетаскивать
        className="relative"
      >
        {/* Слайды */}
        <div className="flex overflow-hidden">
          {items.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full">
                <Link href={`/properties/${item._id}`}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                </Link>
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.location.city}, {item.location.state}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>

        {/* Кнопки навигации */}
        <button
          className={`custom-swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full ${
            isBeginning ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isBeginning}
          aria-label="Предыдущий слайд"
        >
          <FaArrowLeft className="text-blue-500" />
        </button>

        <button
          className={`custom-swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full ${
            isEnd ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isEnd}
          aria-label="Следующий слайд"
        >
          <FaArrowRight className="text-blue-500" />
        </button>
      </Swiper>
    </div>
  );
};

export default RecentlyViewedSlider;
