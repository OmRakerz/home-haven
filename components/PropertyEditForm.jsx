"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { toastSuccess, toastError } from "@/components/Toasts";
import { fetchProperty } from "@/utils/requests";
import { propertyTypeTranslations } from "@/utils/propertyTypes";

const PropertyEditForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState({
    type: "",
    name: "",
    description: "",
    location: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    beds: "",
    baths: "",
    square_meters: "",
    amenities: [],
    rates: {
      weekly: "",
      monthly: "",
      nightly: "",
    },
    seller_info: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Извлечем данные о недвижимости (property), используя функцию fetchProperty
    const fetchPropertyData = async () => {
      try {
        const propertyData = await fetchProperty(id);

        // Проверим и установим значения по умолчанию для каждого значения (rates), если они не равны null
        if (propertyData && propertyData.rates) {
          const defaultRates = { ...propertyData.rates };
          for (const rate in defaultRates) {
            if (defaultRates[rate] === null) {
              defaultRates[rate] = "";
            }
          }
          propertyData.rates = defaultRates;
        }

        setFields(propertyData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Проверяем, вложенное ли свойство
    if (name === "seller_info.phone") {
      const formattedPhone = formatPhoneNumber(value);
      updateField(name, formattedPhone);
      return;
    }

    if (name.includes(".")) {
      updateField(name, value);
    } else {
      // Не вложен
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const updateField = (name, value) => {
    const [outerKey, innerKey] = name.split(".");
    setFields((prevFields) => ({
      ...prevFields,
      [outerKey]: {
        ...prevFields[outerKey],
        [innerKey]: value,
      },
    }));
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 1) return value;
    if (phoneNumberLength <= 1) return `+${phoneNumber}`;
    if (phoneNumberLength <= 4)
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1)}`;
    if (phoneNumberLength <= 7)
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
        1,
        4
      )}) ${phoneNumber.slice(4)}`;
    if (phoneNumberLength <= 9)
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
        1,
        4
      )}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
    return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(
      1,
      4
    )}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(
      7,
      9
    )}-${phoneNumber.slice(9, 11)}`;
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    // Клонируем текущий массив (array) удобств (amenities)
    const updateAmenites = [...fields.amenities];

    if (checked) {
      // Добавим значение в массив
      updateAmenites.push(value);
    } else {
      // Удалим значение из массива
      const index = updateAmenites.indexOf(value);

      if (index !== -1) {
        updateAmenites.splice(index, 1);
      }
    }

    // Обновим состояние (state) с помощью обновленного массива
    setFields((prevFields) => ({
      ...prevFields,
      amenities: updateAmenites,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 200) {
        router.push(`/properties/${id}`);
      } else if (res.status === 401 || res.status === 403) {
        toastError("Разрешение отклонено");
      } else {
        toastError("Что-то пошло не так");
      }
    } catch (error) {
      console.log(error);
      toastError("Что-то пошло не так");
    }
  };

  return (
    mounted &&
    !loading && (
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl text-center font-semibold mb-6">
          Редактировать недвижимость
        </h2>

        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
            Тип недвижимости
          </label>
          <select
            id="type"
            name="type"
            className="border rounded w-full py-2 px-3"
            required
            value={fields.type}
            onChange={handleChange}
          >
            {Object.entries(propertyTypeTranslations)
              .filter(([value]) => value !== "All")
              .map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Название объекта
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Например: ЖК «Вилла Ливадия»"
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded w-full py-2 px-3"
            rows="4"
            placeholder="Добавьте описание объекта"
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">Адрес</label>
          <input
            type="text"
            id="street"
            name="location.street"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Улица"
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type="text"
            id="city"
            name="location.city"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Город"
            required
            value={fields.location.city}
            onChange={handleChange}
          />
          <input
            type="text"
            id="state"
            name="location.state"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Область"
            required
            value={fields.location.state}
            onChange={handleChange}
          />
          <input
            type="text"
            id="zipcode"
            name="location.zipcode"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Почтовый индекс"
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4 flex flex-wrap">
          <div className="w-full sm:w-1/3 sm:pr-2 mb-2 sm:mb-0">
            <label
              htmlFor="beds"
              className="block text-gray-700 font-bold mb-2"
            >
              Спальни
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/3 sm:px-2 mb-2 sm:mb-0">
            <label
              htmlFor="baths"
              className="block text-gray-700 font-bold mb-2"
            >
              Ванные
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div className="w-full sm:w-1/3 sm:pl-2">
            <label
              htmlFor="square_meters"
              className="block text-gray-700 font-bold mb-2"
            >
              Площадь (м²)
            </label>
            <input
              type="number"
              id="square_meters"
              name="square_meters"
              className="border rounded w-full py-2 px-3"
              required
              value={fields.square_meters}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Удобства</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <input
                type="checkbox"
                id="amenity_wifi"
                name="amenities"
                value="Wifi"
                className="mr-2"
                checked={fields.amenities.includes("Wifi")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wifi">Wifi</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_kitchen"
                name="amenities"
                value="Полноценная кухня"
                className="mr-2"
                checked={fields.amenities.includes("Полноценная кухня")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_kitchen">Полноценная кухня</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_washer_dryer"
                name="amenities"
                value="Сушильная машина"
                className="mr-2"
                checked={fields.amenities.includes("Сушильная машина")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_washer_dryer">Сушильная машина</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_free_parking"
                name="amenities"
                value="Бесплатная парковка"
                className="mr-2"
                checked={fields.amenities.includes("Бесплатная парковка")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_free_parking">Бесплатная парковка</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_pool"
                name="amenities"
                value="Бассейн"
                className="mr-2"
                checked={fields.amenities.includes("Бассейн")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_pool">Бассейн</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_hot_tub"
                name="amenities"
                value="Джакузи"
                className="mr-2"
                checked={fields.amenities.includes("Джакузи")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_hot_tub">Джакузи</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_24_7_security"
                name="amenities"
                value="Пылесос"
                className="mr-2"
                checked={fields.amenities.includes("Пылесос")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_24_7_security">Пылесос</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_wheelchair_accessible"
                name="amenities"
                value="Пандус"
                className="mr-2"
                checked={fields.amenities.includes("Пандус")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_wheelchair_accessible">Пандус</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_elevator_access"
                name="amenities"
                value="Лифт"
                className="mr-2"
                checked={fields.amenities.includes("Лифт")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_elevator_access">Лифт</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_dishwasher"
                name="amenities"
                value="Посудомоечная машина"
                className="mr-2"
                checked={fields.amenities.includes("Посудомоечная машина")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_dishwasher">Посудомоечная машина</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_gym_fitness_center"
                name="amenities"
                value="Тренажерный зал"
                className="mr-2"
                checked={fields.amenities.includes("Тренажерный зал")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_gym_fitness_center">
                Тренажерный зал
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_air_conditioning"
                name="amenities"
                value="Кондиционер"
                className="mr-2"
                checked={fields.amenities.includes("Кондиционер")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_air_conditioning">Кондиционер</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_balcony_patio"
                name="amenities"
                value="Балкон/Терраса"
                className="mr-2"
                checked={fields.amenities.includes("Балкон/Терраса")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_balcony_patio">Балкон/Терраса</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_smart_tv"
                name="amenities"
                value="Smart TV"
                className="mr-2"
                checked={fields.amenities.includes("Smart TV")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_smart_tv">Smart TV</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_coffee_maker"
                name="amenities"
                value="Кофемашина"
                className="mr-2"
                checked={fields.amenities.includes("Кофемашина")}
                onChange={handleAmenitiesChange}
              />
              <label htmlFor="amenity_coffee_maker">Кофемашина</label>
            </div>
          </div>
        </div>

        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">
            Цены (оставьте пустым, если не применяется)
          </label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="weekly_rate" className="mr-2">
                Недельная
              </label>
              <input
                type="number"
                id="weekly_rate"
                name="rates.weekly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.weekly}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="monthly_rate" className="mr-2">
                Месячная
              </label>
              <input
                type="number"
                id="monthly_rate"
                name="rates.monthly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.monthly}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="nightly_rate" className="mr-2">
                Ночная
              </label>
              <input
                type="number"
                id="nightly_rate"
                name="rates.nightly"
                className="border rounded w-full py-2 px-3"
                value={fields.rates.nightly}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="seller_name"
            className="block text-gray-700 font-bold mb-2"
          >
            Имя владельца
          </label>
          <input
            type="text"
            id="seller_name"
            name="seller_info.name"
            className="border rounded w-full py-2 px-3"
            placeholder="Имя"
            value={fields.seller_info.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
            Почта владельца
          </label>
          <input
            type="email"
            id="seller_email"
            name="seller_info.email"
            className="border rounded w-full py-2 px-3"
            placeholder="Email address"
            required
            value={fields.seller_info.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="seller_phone"
            className="block text-gray-700 font-bold mb-2"
          >
            Телефон владельца
          </label>
          <input
            type="tel"
            id="seller_phone"
            name="seller_info.phone"
            className="border rounded w-full py-2 px-3"
            placeholder="+7 (___) ___-__-__"
            value={fields.seller_info.phone}
            onChange={handleChange}
            maxLength="18"
          />
        </div>

        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Обновить данные
          </button>
        </div>
      </form>
    )
  );
};
export default PropertyEditForm;
