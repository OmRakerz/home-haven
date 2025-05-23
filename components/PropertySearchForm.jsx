"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { propertyTypeTranslations } from "@/utils/propertyTypes";

const PropertySearchForm = () => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (location === "" && propertyType === "All") {
      router.push("/properties");
    } else {
      // Создайте строку запроса из данных формы
      const query = `?location=${location}&propertyType=${propertyType}`;

      // Перенаправление на страницу поиска со строкой запроса
      router.push(`/properties/search-results${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
        <label htmlFor="location" className="sr-only">
          Местоположение
        </label>
        <input
          type="text"
          id="location"
          placeholder="Введите название или расположение"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="w-full md:w-2/5 md:pl-2">
        <label htmlFor="property-type" className="sr-only">
          Тип недвижимости
        </label>
        <select
          id="property-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          {/* <option value="All">Все</option>
          <option value="Apartment">Апартаменты</option>
          <option value="Studio">Студия</option>
          <option value="Condo">Квартира</option>
          <option value="House">Дом</option>
          <option value="Cabin Or Cottage">Дача или коттедж</option>
          <option value="Loft">Лофт</option>
          <option value="Room">Комната</option>
          <option value="Other">Другое</option> */}
          {Object.entries(propertyTypeTranslations).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Поиск
      </button>
    </form>
  );
};

export default PropertySearchForm;
