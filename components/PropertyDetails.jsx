import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useState } from "react";
import PropertyMap from "@/components/PropertyMap";
import { propertyTypeTranslations } from "@/utils/propertyTypes";
import { declension } from "@/utils/declension";

const PropertyDetails = ({ property }) => {
  const [isContactsExpanded, setIsContactsExpanded] = useState(false);

  // Функция для форматирования описания с сохранением абзацев
  const formatDescription = (description) => {
    if (!description) return null;

    return description.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 text-left">
        {paragraph}
      </p>
    ));
  };

  const formatCreatedAt = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Форматируем дату как "9 мая"
    const dateOptions = { day: "numeric", month: "long" };
    const formattedDate = date.toLocaleDateString("ru-RU", dateOptions);

    // Форматируем время как "10:48"
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const formattedTime = date.toLocaleTimeString("ru-RU", timeOptions);

    return `${formattedDate} в ${formattedTime}`;
  };

  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">
          {propertyTypeTranslations[property.type] || property.type}
          <span className="text-gray-400 ml-2">
            • {formatCreatedAt(property.createdAt)}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <FaMapMarker className="text-lg text-orange-700 mr-2" />
          <p className="text-orange-700">
            {property.location.street}, {property.location.city},{" "}
            {property.location.state}
          </p>
        </div>

        <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
          Цены и опции
        </h3>
        <div className="flex flex-col md:flex-row justify-around">
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">За ночь</div>
            <div className="text-2xl font-bold text-blue-500">
              {property.rates.nightly ? (
                `₽${property.rates.nightly.toLocaleString()}`
              ) : (
                <FaTimes className="text-red-700" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">За неделю</div>
            <div className="text-2xl font-bold text-blue-500">
              {property.rates.weekly ? (
                `₽${property.rates.weekly.toLocaleString()}`
              ) : (
                <FaTimes className="text-red-700" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">За месяц</div>
            <div className="text-2xl font-bold text-blue-500">
              {property.rates.monthly ? (
                `₽${property.rates.monthly.toLocaleString()}`
              ) : (
                <FaTimes className="text-red-700" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Описание и детали</h3>
        <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
          <p>
            <FaBed className="inline-block mr-2" /> {property.beds}{" "}
            <span className="hidden sm:inline">
              {declension(property.beds, ["Спальня", "Спальни", "Спален"])}
            </span>
          </p>
          <p>
            <FaBath className="inline-block mr-2" /> {property.baths}{" "}
            <span className="hidden sm:inline">
              {declension(property.baths, ["Ванная", "Ванные", "Ванных"])}
            </span>
          </p>
          <p>
            <i className="fa-solid fa-ruler-combined"></i>
            <FaRulerCombined className="inline-block mr-2" />
            {property.square_meters}{" "}
            <span className="hidden sm:inline">м²</span>
          </p>
        </div>
        <div className="text-gray-500 mb-4 whitespace-pre-line">
          {formatDescription(property.description)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Удобства</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {property.amenities.map((amenity, index) => (
            <li key={index}>
              <FaCheck className="inline-block text-green-600 mr-2" /> {amenity}
            </li>
          ))}
        </ul>
      </div>

      {/* Новый блок контактов владельца */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setIsContactsExpanded(!isContactsExpanded)}
        >
          <h3 className="text-lg font-bold">Контакты владельца</h3>
          {isContactsExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </button>

        {isContactsExpanded && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <FaUser className="text-blue-500 mr-3 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">Имя</p>
                <p className="font-medium">
                  {property.seller_info?.name || "Не указано"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FaEnvelope className="text-blue-500 mr-3 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">
                  {property.seller_info?.email || "Не указано"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FaPhone className="text-blue-500 mr-3 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">Телефон</p>
                <p className="font-medium">
                  {property.seller_info?.phone || "Не указано"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <PropertyMap property={property} />
      </div>
    </main>
  );
};

export default PropertyDetails;
