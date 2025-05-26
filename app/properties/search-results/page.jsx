"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import PropertySearchForm from "@/components/PropertySearchForm";
import Pagination from "@/components/Pagination";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0); // Общее количество объявлений

  const pageSize = 6; // Количество объявлений на странице
  const page = parseInt(searchParams.get("page")) || 1;

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
          page, // Добавляем номер страницы
        };

        // Формируем URL с параметрами
        const queryString = Object.entries(params)
          .filter(([_, value]) => value !== null && value !== "")
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const res = await fetch(`/api/properties/search?${queryString}`);

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data.properties || []);
          setTotalItems(data.total || data.length || 0);
        } else {
          setProperties([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.log(error);
        setProperties([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams, page]);

  // Обработчик изменения страницы
  const handlePageChange = (newPage) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentParams.set("page", newPage);
    router.push(`/properties/search-results?${currentParams.toString()}`);
  };

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
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Показываем пагинацию только если больше или равно 7 объявлений */}
                {totalItems > pageSize && (
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default SearchResultsPage;
