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

  // Форматирование чисел с пробелами
  const formatNumberWithSpaces = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const parseNumberWithSpaces = (value) => {
    return value.replace(/\D/g, "");
  };

  // Форматирование вывода типов недвижимости
  const formatTypesDisplay = () => {
    if (propertyTypes.includes("All") || propertyTypes.length === 0)
      return "Все";
    if (propertyTypes.length >= 3)
      return `${propertyTypes
        .slice(0, 2)
        .map((t) => propertyTypeTranslations[t])
        .join(", ")}...`;
    return propertyTypes
      .map((type) => propertyTypeTranslations[type])
      .join(", ");
  };

  // Переключение типа недвижимости
  const togglePropertyType = (type) => {
    setPropertyTypes((prev) => {
      if (type === "All") {
        return ["All"];
      } else if (prev.includes("All")) {
        return [type];
      } else if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
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
    if (priceFrom && priceTo)
      return `${formatNumberWithSpaces(priceFrom)}–${formatNumberWithSpaces(
        priceTo
      )} ₽`;
    if (priceFrom) return `от ${formatNumberWithSpaces(priceFrom)} ₽`;
    if (priceTo) return `до ${formatNumberWithSpaces(priceTo)} ₽`;
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (location) queryParams.append("location", location);
    if (propertyTypes.length > 0 && !propertyTypes.includes("All"))
      queryParams.append("propertyType", propertyTypes.join(","));
    if (rooms.length > 0) queryParams.append("rooms", rooms.join(","));
    if (priceFrom) queryParams.append("priceFrom", priceFrom);
    if (priceTo) queryParams.append("priceTo", priceTo);

    router.push(`/properties/search-results?${queryParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-stretch w-full max-w-6xl mx-auto bg-white rounded-lg border border-blue-500 shadow-md"
    >
      {/* Тип недвижимости */}
      <div
        ref={typesRef}
        className="relative flex-1 w-full border-r border-blue-500"
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
          <span className="truncate">{formatTypesDisplay()}</span>
          {showTypesDropdown ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showTypesDropdown && (
          <div className="absolute z-50 left-0 right-0 mt-1 w-full bg-white border border-blue-500 rounded-md shadow-lg p-2 animate-fadeIn">
            {Object.entries(propertyTypeTranslations).map(([value, label]) => (
              <div key={value} className="py-2 hover:bg-blue-50">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={propertyTypes.includes(value)}
                      onChange={() => togglePropertyType(value)}
                      className="sr-only" // скрытый оригинальный чекбокс
                    />
                    {/* Кастомный чекбокс */}
                    <div
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                        propertyTypes.includes(value)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {propertyTypes.includes(value) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
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
        className="relative flex-1 w-full border-r border-blue-500"
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
          <div className="absolute z-50 left-0 right-0 mt-1 w-full bg-white border border-blue-500 rounded-md shadow-lg p-2">
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
        className="relative flex-1 w-full border-r border-blue-500"
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
          <div className="absolute z-50 left-0 right-0 mt-1 w-full bg-white border border-blue-500 rounded-md shadow-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative input-wrapper">
                <label htmlFor="priceFromDropdown" className="input-label">
                  от
                </label>
                <input
                  id="priceFromDropdown"
                  type="text"
                  inputMode="numeric"
                  value={priceFrom ? formatNumberWithSpaces(priceFrom) : ""}
                  onChange={(e) =>
                    setPriceFrom(parseNumberWithSpaces(e.target.value))
                  }
                  className="w-full px-8 py-2 border border-blue-500 rounded-md focus:ring-blue-500 focus:border-blue-700"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="input-icon text-gray-400">₽</span>
              </div>
              <div className="flex-1 relative input-wrapper">
                <label htmlFor="priceToDropdown" className="input-label">
                  до
                </label>
                <input
                  id="priceToDropdown"
                  type="text"
                  inputMode="numeric"
                  value={priceTo ? formatNumberWithSpaces(priceTo) : ""}
                  onChange={(e) =>
                    setPriceTo(parseNumberWithSpaces(e.target.value))
                  }
                  className="w-full px-8 py-2 border border-blue-500 rounded-md focus:ring-blue-500 focus:border-blue-700"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="input-icon text-gray-400">₽</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Местоположение + кнопка поиска */}
      <div className="relative flex items-center bg-blue-500 overflow-hidden rounded-r-lg">
        {/* Поле ввода местоположения */}
        <input
          type="text"
          placeholder="Город, ЖК, адрес, район"
          className="flex-1 px-6 py-3 bg-white rounded-r-xl border border-blue-500 focus:outline-none focus:border-blue-700"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Кнопка поиска */}
        <button
          type="submit"
          className="px-10 py-3 bg-blue-500 text-white font-medium transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-r-lg"
        >
          Поиск
        </button>
      </div>
    </form>
  );
};

export default PropertySearchForm;
