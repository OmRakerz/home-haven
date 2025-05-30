import Image from "next/image";
import Link from "next/link";
import { propertyTypeTranslations } from "@/utils/propertyTypes";
import { declension } from "@/utils/declension";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBill,
  FaMapMarker,
} from "react-icons/fa";

const PropertyCard = ({ property }) => {
  const getRateDisplay = () => {
    const { rates } = property;

    if (rates.monthly) {
      return `${rates.monthly.toLocaleString()}₽/мес`;
    } else if (rates.weekly) {
      return `${rates.weekly.toLocaleString()}₽/нед`;
    } else if (rates.nightly) {
      return `${rates.nightly.toLocaleString()}₽/ночь`;
    }
  };

  const formatCreatedAt = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const dateOptions = { day: "numeric", month: "long" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = date.toLocaleDateString("ru-RU", dateOptions);
    const formattedTime = date.toLocaleTimeString("ru-RU", timeOptions);

    return `${formattedDate} в ${formattedTime}`;
  };

  return (
    <div className="rounded-xl shadow-md relative flex flex-col justify-between bg-blue-50">
      <Image
        src={property.images[0]}
        alt=""
        height={0}
        width={0}
        sizes="100vw"
        className="w-full h-auto rounded-t-xl"
      />
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              {propertyTypeTranslations[property.type] || property.type}
            </div>
            <span className="text-gray-400 text-sm ml-2 hidden md:inline-block">
              {formatCreatedAt(property.createdAt)}
            </span>
          </div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>

        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
          {getRateDisplay()}
        </h3>

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

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <FaMapMarker className="text-orange-700 mt-1" />
            <span className="text-orange-700">
              {" "}
              {property.location.city} {property.location.state}{" "}
            </span>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
