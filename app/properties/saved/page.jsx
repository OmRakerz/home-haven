"use client";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import BookmarkPropertyCard from "@/components/BookmarkPropertyCard";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { toastSuccess, toastError } from "@/components/Toasts";

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // Получаем список закладок
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch("/api/bookmarks");

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          toastError("Не удалось получить данные");
        }
      } catch (error) {
        console.error("Ошибка при загрузке закладок:", error);
        toastError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [page]);

  const totalItems = properties.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedProperties = properties.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Удаление из закладок
  const handleRemoveBookmark = async (propertyId) => {
    try {
      const res = await fetch(`/api/bookmarks/${propertyId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        setProperties((prev) => prev.filter((prop) => prop._id !== propertyId));

        // После удаления проверим, есть ли ещё объекты на текущей странице
        const newPropertiesCount = properties.length - 1;
        const newTotalPages = Math.ceil(newPropertiesCount / pageSize);

        // Если текущая страница превышает новое количество страниц — перейдём на последнюю доступную
        if (page > newTotalPages && newTotalPages >= 1) {
          setPage(newTotalPages);
        }

        toastSuccess("Объявление удалено из закладок");
      } else {
        toastError("Не удалось удалить из закладок");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      toastError("Что-то пошло не так");
    }
  };

  return (
    <section className="px-4 py-6 flex-1">
      <h1 className="text-3xl xl:text-4xl mb-4 text-center font-bold underline">
        Сохранённые объявления
        <FaBookmark className="ml-2 inline-block text-3xl xl:text-4xl pb-1 xl:pb-2" />
      </h1>

      {loading ? (
        <Spinner loading={loading} />
      ) : totalItems === 0 ? (
        <p className="text-center">Нет сохранённых объявлений</p>
      ) : (
        <>
          {/* Список карточек */}
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedProperties.map((property) => (
                <BookmarkPropertyCard
                  key={property._id}
                  property={property}
                  onRemove={() => handleRemoveBookmark(property._id)}
                />
              ))}
            </div>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
};

export default SavedPropertiesPage;
