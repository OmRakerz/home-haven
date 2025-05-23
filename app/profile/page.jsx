"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";
import { declension } from "@/utils/declension";
import { toastSuccess, toastError } from "@/components/Toasts";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState("newest");
  const [showSort, setShowSort] = useState(false);

  // Состояние для пагинации
  const [page, setPage] = useState(1);
  const pageSize = 2; // Отображать по 2 объявления на странице

  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) return;

      try {
        const res = await fetch(`/api/properties/user/${userId}`);

        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Извлекаем недвижимость (properties) пользователя, когда сессия доступна
    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту недвижимость?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        // Удалим недвижимость из состояния (state)
        const updatedProperties = properties.filter(
          (property) => property._id !== propertyId
        );

        setProperties(updatedProperties);

        toastSuccess("Недвижимость удалена");
      } else {
        toastError("Не удалось удалить недвижимость");
      }
    } catch (error) {
      console.log(error);
      toastError("Не удалось удалить недвижимость");
    }
  };

  // Форматирование даты создания
  const formatCreatedAt = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dateOptions = { day: "numeric", month: "long" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const formattedDate = date.toLocaleDateString("ru-RU", dateOptions);
    const formattedTime = date.toLocaleTimeString("ru-RU", timeOptions);
    return `${formattedDate} в ${formattedTime}`;
  };

  // Сортировка
  const sortedProperties = [...properties].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Пагинация
  const totalItems = sortedProperties.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedProperties = sortedProperties.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <section className="bg-blue-50 flex-1">
      <div className="max-w-5xl mx-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-xl rounded-xl m-4 md:m-0">
          <div className="flex flex-col md:flex-row">
            {/* Левая часть: информация о пользователе */}
            <div className="md:w-1/4 md:ml-8 md:mr-28 mb-8 md:mb-0">
              <h1 className="text-3xl font-bold mb-4 underline">Ваш профиль</h1>
              <div className="mb-4">
                <Image
                  className="h-32 w-32 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>
              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Имя: </span> {profileName}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            {/* Правая часть: объявления пользователя */}
            <div className="md:w-3/4 md:pl-4">
              {/* Счётчик и сортировка */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-2xl font-semibold mb-2 sm:mb-0">
                  У вас {properties.length}{" "}
                  {declension(properties.length, [
                    "объявление",
                    "объявления",
                    "объявлений",
                  ])}
                </h2>

                {/* Выпадающий список сортировки */}
                <div className="relative inline-block w-full sm:w-auto">
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className={`block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors ${
                      showSort ? "ring-2 ring-blue-500" : ""
                    }`}
                    type="button"
                    aria-expanded={showSort}
                  >
                    {sortOrder === "newest"
                      ? "Сначала новые"
                      : "Сначала старые"}
                    <span className="float-right ml-2">
                      {showSort ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  {/* Выпадающее меню с анимацией */}
                  <div
                    className={`absolute right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-full max-w-full overflow-hidden ${
                      showSort
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    } transition-opacity duration-300 ease-in-out`}
                  >
                    <ul>
                      <li>
                        <button
                          onClick={() => {
                            setSortOrder("newest");
                            setShowSort(false);
                            setPage(1);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 ${
                            sortOrder === "newest"
                              ? "bg-blue-50 text-blue-600 font-bold"
                              : "text-gray-700"
                          }`}
                          type="button"
                        >
                          Сначала новые
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setSortOrder("oldest");
                            setShowSort(false);
                            setPage(1);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 ${
                            sortOrder === "oldest"
                              ? "bg-blue-50 text-blue-600 font-bold"
                              : "text-gray-700"
                          }`}
                          type="button"
                        >
                          Сначала старые
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {!loading && properties.length === 0 && (
                <p>У вас нет объявлений</p>
              )}

              {loading ? (
                <Spinner loading={loading} />
              ) : (
                <>
                  {/* Список объявлений */}
                  {paginatedProperties.map((property) => (
                    <div key={property._id} className="mb-10">
                      <Link href={`/properties/${property._id}`}>
                        <Image
                          className="h-32 w-full rounded-md object-cover"
                          src={property.images[0]}
                          alt=""
                          width={500}
                          height={100}
                          priority={true}
                        />
                      </Link>
                      <div className="mt-2">
                        <p className="text-lg font-semibold">{property.name}</p>
                        <p className="text-gray-600">
                          Адрес: {property.location.street},{" "}
                          {property.location.city}, {property.location.state}
                        </p>
                        <p className="text-gray-600 mt-1">
                          • Добавлено: {formatCreatedAt(property.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2">
                        <Link
                          href={`/properties/${property._id}/edit`}
                          className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                        >
                          Изменить
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                          type="button"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Пагинация */}
                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      pageSize={pageSize}
                      totalItems={totalItems}
                      onPageChange={setPage}
                      showArrowsOnly
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
