"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { toastError } from "@/components/Toasts";
import { FaBookmark } from "react-icons/fa";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch("/api/bookmarks");

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          console.log(res.statusText);
          toastError("Не удалось получить сохраненные недвижимости");
        }
      } catch (error) {
        console.log(error);
        toastError("Не удалось получить сохраненные недвижимости");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="px-4 py-6 flex-1">
      <h1 className="text-3xl xl:text-4xl mb-4 text-center font-bold underline">
        Сохранённые объявления
        <FaBookmark className="ml-2 inline-block text-3xl xl:text-4xl pb-1 xl:pb-2" />
      </h1>
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>Нет сохраненных объектов недвижимости</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedPropertiesPage;
