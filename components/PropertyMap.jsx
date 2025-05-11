"use client";
import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [mapReady, setMapReady] = useState(false);
  const [coords, setCoords] = useState(null);
  const [geocodeError, setGeocodeError] = useState(false); // Новое состояние для ошибок
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const placemarkRef = useRef(null);

  // Формируем полный адрес
  const getFullAddress = () => {
    return [
      property.location.street,
      property.location.city,
      property.location.state,
      property.location.zipcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // Получаем координаты
  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${
          process.env.NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY
        }&format=json&geocode=${encodeURIComponent(getFullAddress())}`
      );
      const data = await response.json();

      const found = data.response.GeoObjectCollection?.featureMember?.[0];
      if (!found) throw new Error("Адрес не найден");

      const [lng, lat] = found.GeoObject.Point.pos.split(" ").map(Number);
      setGeocodeError(false); // Ошибок нет
      return [lat, lng];
    } catch (error) {
      console.error("Ошибка геокодирования:", error);
      setGeocodeError(true); // Устанавливаем флаг ошибки
      return null;
    }
  };

  // Создаем кастомную иконку маркера
  const createCustomIcon = () => {
    return new window.ymaps.Placemark(
      coords,
      {
        balloonContentHeader: property.name,
        balloonContentBody: `
          <div class="flex flex-col gap-2">
            <div class="text-gray-700">${getFullAddress()}</div>
            <img 
              src="${property.images[0]}" 
              alt="Property" 
              class="w-full h-32 object-cover rounded-lg"
            />
          </div>
        `,
        hintContent: property.name,
      },
      {
        // Кастомная иконка из SVG
        iconLayout: "default#image",
        iconImageHref: pin.src,
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40],
      }
    );
  };

  // Инициализация карты
  useEffect(() => {
    if (!mapReady || !coords) return;

    window.ymaps.ready(() => {
      // Создаем карту
      mapInstance.current = new window.ymaps.Map(mapContainer.current, {
        center: coords,
        zoom: 15,
        controls: ["zoomControl"],
      });

      // Создаем и добавляем маркер
      placemarkRef.current = createCustomIcon();
      mapInstance.current.geoObjects.add(placemarkRef.current);

      // Открываем балун автоматически
      placemarkRef.current.balloon.open();
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [mapReady, coords]);

  // Загрузка координат
  useEffect(() => {
    if (!mapReady) return;

    const initMap = async () => {
      const coordinates = await fetchCoordinates();
      if (coordinates) setCoords(coordinates);
    };

    initMap();
  }, [mapReady]);

  // Если есть ошибка геокодирования — выводим сообщение
  if (geocodeError) {
    return (
      <div className="text-xl text-center py-8 text-red-600">
        Не удалось определить местоположение по указанному адресу.
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full bg-gray-100">
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => setMapReady(true)}
      />

      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ height: "100%", width: "100%" }}
      />

      {/* Показываем спиннер, пока карта или координаты не загружены */}
      {(!coords || !mapReady) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner loading={true} />
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
