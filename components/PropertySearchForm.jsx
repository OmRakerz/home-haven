"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertyTypeTranslations } from "@/utils/propertyTypes";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PropertySearchForm = () => {
  const router = useRouter();

  // Состояния
  const [location, setLocation] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Открытие/закрытие выпадающих меню
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  // Рефы для клика вне области
  const typesRef = useRef(null);
  const roomsRef = useRef(null);
  const priceRef = useRef(null);

  // Закрытие выпадающих списков при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typesRef.current && !typesRef.current.contains(event.target)) {
        setShowTypesDropdown(false);
      }
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (location) queryParams.append("location", location);
    if (propertyTypes.length > 0)
      queryParams.append("propertyType", propertyTypes.join(","));
    if (rooms.length > 0) queryParams.append("rooms", rooms.join(","));
    if (priceFrom) queryParams.append("priceFrom", priceFrom);
    if (priceTo) queryParams.append("priceTo", priceTo);

    router.push(`/properties/search-results?${queryParams.toString()}`);
  };

  // Переключение типа недвижимости
  const togglePropertyType = (type) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Переключение количества комнат
  const toggleRoom = (room) => {
    setRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  // Форматирование вывода комнат
  const formatRoomsDisplay = () => {
    if (rooms.length === 0) return "Комнат";
    if (rooms.length === 1) return `${rooms[0]} комн.`;

    const sorted = rooms.map(Number).sort((a, b) => a - b);
    const isSequential = sorted.every(
      (val, i, arr) => !i || val === arr[i - 1] + 1
    );

    return isSequential
      ? `${sorted[0]}-${sorted[sorted.length - 1]} комн.`
      : `${sorted.join(", ")} комн.`;
  };

  // Форматирование вывода цены
  const formatPriceDisplay = () => {
    if (!priceFrom && !priceTo) return "Цена";
    if (priceFrom && priceTo) return `${priceFrom}-${priceTo}₽`;
    if (priceFrom) return `от ${priceFrom}₽`;
    if (priceTo) return `до ${priceTo}₽`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-center w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-blue-500"
    >
      {/* Тип недвижимости */}
      <div
        ref={typesRef}
        className="relative flex-1 w-full border-r border-blue-200"
      >
        <button
          type="button"
          onClick={() => {
            setShowTypesDropdown(!showTypesDropdown);
            setShowRoomsDropdown(false);
            setShowPriceDropdown(false);
          }}
          className="w-full px-4 py-3 text-left focus:outline-none flex justify-between items-center"
        >
          <span className="truncate">
            {propertyTypes.length === 0
              ? "Все"
              : propertyTypes
                  .map((type) => propertyTypeTranslations[type])
                  .join(", ")}
          </span>
          {showTypesDropdown ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showTypesDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-blue-200 rounded-md shadow-lg dropdown-enter">
            {Object.entries(propertyTypeTranslations).map(([value, label]) => (
              <div key={value} className="px-4 py-2 hover:bg-blue-50">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(value)}
                    onChange={() => togglePropertyType(value)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{label}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Количество комнат */}
      <div
        ref={roomsRef}
        className="relative flex-1 w-full border-r border-blue-200"
      >
        <button
          type="button"
          onClick={() => {
            setShowRoomsDropdown(!showRoomsDropdown);
            setShowTypesDropdown(false);
            setShowPriceDropdown(false);
          }}
          className="w-full px-4 py-3 text-left focus:outline-none flex justify-between items-center"
        >
          <span>{formatRoomsDisplay()}</span>
          {showRoomsDropdown ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showRoomsDropdown && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-blue-200 rounded-md shadow-lg p-2">
            <div className="flex flex-wrap gap-2 p-2">
              {["1", "2", "3", "4", "5+"].map((room) => (
                <button
                  key={room}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRoom(room);
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    rooms.includes(room)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Цена */}
      <div
        ref={priceRef}
        className="relative flex-1 w-full border-r border-blue-200"
      >
        <button
          type="button"
          onClick={() => {
            setShowPriceDropdown(!showPriceDropdown);
            setShowTypesDropdown(false);
            setShowRoomsDropdown(false);
          }}
          className="w-full px-4 py-3 text-left focus:outline-none flex justify-between items-center"
        >
          <span>{formatPriceDisplay()}</span>
          {showPriceDropdown ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showPriceDropdown && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-blue-200 rounded-md shadow-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">от</label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">до</label>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  placeholder="∞"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Местоположение */}
      <div className="flex-1 w-full border-r border-blue-200">
        <input
          type="text"
          placeholder="Город, ЖК, адрес, район"
          className="w-full px-4 py-3 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Кнопка поиска */}
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Поиск
      </button>
    </form>
  );
};

export default PropertySearchForm;
