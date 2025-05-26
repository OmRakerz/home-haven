"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import PropertySearchForm from "@/components/PropertySearchForm";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Получаем все параметры поиска
        const params = {
          location: searchParams.get("location"),
          propertyType: searchParams.get("propertyType"),
          rooms: searchParams.get("rooms"),
          priceFrom: searchParams.get("priceFrom"),
          priceTo: searchParams.get("priceTo"),
        };

        // Формируем URL с параметрами
        const queryString = Object.entries(params)
          .filter(([_, value]) => value !== null)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const res = await fetch(`/api/properties/search?${queryString}`);

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="container mx-auto px-4">
          <PropertySearchForm />
        </div>
      </section>

      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <section className="px-4 py-6">
          <div className="container-xl lg:container m-auto px-4 py-6">
            <Link
              href="/properties"
              className="flex items-center text-blue-500 hover:underline mb-3"
            >
              <FaArrowAltCircleLeft className="mr-2" /> Назад к недвижимости
            </Link>
            <h1 className="text-3xl font-bold mb-6 text-center">
              Результаты поиска
              <FaMagnifyingGlassLocation className="ml-2 inline-block" />
            </h1>
            {properties.length === 0 ? (
              <p>По вашему запросу ничего не найдено</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SearchResultsPage;
