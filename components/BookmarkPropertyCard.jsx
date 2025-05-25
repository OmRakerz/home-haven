"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import { toastSuccess, toastError } from "@/components/Toasts";
import { declension } from "@/utils/declension";
import { propertyTypeTranslations } from "@/utils/propertyTypes";

const BookmarkPropertyCard = ({ property, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const getRateDisplay = () => {
    if (property.rates.monthly) {
      return `${property.rates.monthly.toLocaleString()}₽/мес`;
    } else if (property.rates.weekly) {
      return `${property.rates.weekly.toLocaleString()}₽/нед`;
    } else if (property.rates.nightly) {
      return `${property.rates.nightly.toLocaleString()}₽/ночь`;
    }
  };

  const handleRemoveClick = async (e) => {
    e.preventDefault(); // Чтобы не перезагружало страницу
    if (!onRemove || !property._id) return;

    setIsRemoving(true); // Запуск анимации

    try {
      const res = await fetch(`/api/bookmarks/${property._id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        setTimeout(() => {
          onRemove(property._id);
        }, 50); // Ждём окончания анимации перед обновлением состояния
      } else {
        setIsRemoving(false);
        toastError("Не удалось удалить из закладок");
      }
    } catch (error) {
      setIsRemoving(false);
      console.error("Ошибка при удалении:", error);
      toastError("Что-то пошло не так");
    }
  };

  return (
    <div
      className={`relative group transition-all duration-300 ${
        isRemoving
          ? "opacity-0 translate-y-[-20px]"
          : "opacity-100 translate-y-0"
      }`}
    >
      {/* Карточка */}
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
          isRemoving ? "scale-100 opacity-100" : "scale-100 opacity-100"
        }`}
      >
        <div className="rounded-xl shadow-md relative flex flex-col justify-between bg-blue-50">
          {/* Картинка объекта */}
          <Image
            src={property.images[0]}
            alt=""
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto rounded-t-xl"
          />

          {/* Иконка удаления из закладок */}
          <button
            onClick={handleRemoveClick}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 z-10"
            aria-label="Удалить из закладок"
          >
            <FaRegBookmark size={20} />
          </button>

          {/* Основная информация */}
          <div className="p-4">
            <div className="text-left md:text-center lg:text-left mb-6">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  {propertyTypeTranslations[property.type] || property.type}
                </div>
                <span className="text-gray-400 text-sm ml-2 hidden md:inline-block">
                  {property.createdAt
                    ? new Date(property.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })
                    : ""}{" "}
                  в{" "}
                  {property.createdAt
                    ? new Date(property.createdAt).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              <h3 className="text-xl font-bold truncate">{property.name}</h3>
            </div>

            {/* Цена недвижимости */}
            <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
              {getRateDisplay()}
            </h3>

            {/* Спальни / Ванные / Площадь */}
            <div className="flex justify-center gap-4 text-gray-500 mb-4">
              <p>
                <FaBed className="inline mr-2" /> {property.beds}{" "}
                <span className="md:hidden lg:inline">
                  {declension(property.beds, ["Спальня", "Спальни", "Спален"])}
                </span>
              </p>
              <p>
                <FaBath className="inline mr-2" /> {property.baths}{" "}
                <span className="md:hidden lg:inline">
                  {declension(property.baths, ["Ванная", "Ванные", "Ванных"])}
                </span>
              </p>
              <p>
                <FaRulerCombined className="inline mr-2" />
                {property.square_meters}{" "}
                <span className="md:hidden lg:inline">м²</span>
              </p>
            </div>

            {/* На ночь / неделю / месяц */}
            <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
              {property.rates.nightly && (
                <p>
                  <FaMoneyBill className="inline mr-2" /> На ночь
                </p>
              )}
              {property.rates.weekly && (
                <p>
                  <FaMoneyBill className="inline mr-2" /> На неделю
                </p>
              )}
              {property.rates.monthly && (
                <p>
                  <FaMoneyBill className="inline mr-2" /> На месяц
                </p>
              )}
            </div>

            <div className="border border-gray-100 mb-5"></div>

            {/* Адрес + Подробнее */}
            <div className="flex flex-col mb-4">
              <div className="flex align-middle gap-2 mb-2">
                <FaMapMarker className="text-orange-700 mt-1" />
                <span className="text-orange-700">
                  {property.location.city}, {property.location.state}
                </span>
              </div>

              <Link
                href={`/properties/${property._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm mt-auto"
              >
                Подробнее
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPropertyCard;
