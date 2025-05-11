"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";

const Message = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setIsDeleted] = useState(false);

  const { setUnreadCount } = useGlobalContext();

  const handleReadClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "PUT",
      });

      if (res.status === 200) {
        const { read } = await res.json();
        setIsRead(read);
        setUnreadCount((prevCount) => (read ? prevCount - 1 : prevCount + 1));
        if (read) {
          toast.success("Сообщение отмечено как прочитанное");
        } else {
          toast.success("Отмечено как новое");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Что-то пошло не так");
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        setIsDeleted(true);
        setUnreadCount((prevCount) => prevCount - 1);
        toast.success("Сообщение удалено");
      }
    } catch (error) {
      console.log(error);
      toast.error("Сообщение не было удалено");
    }
  };

  if (isDeleted) {
    return null; // Возвращаем null, чтобы ничего не отобразить, если сообщение удалено
  }

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short", // "чт"
      day: "numeric", // "8"
      month: "long", // "мая"
      hour: "2-digit", // "22"
      minute: "2-digit", // "58"
    };

    return date.toLocaleString("ru-RU", options);
  };
  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
          Новое
        </div>
      )}

      <h2 className="text-xl mb-4">
        <span className="font-bold">Запрос по объекту:</span>{" "}
        {message.property.name}
      </h2>
      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Имя:</strong> {message.sender.username}
        </li>

        <li>
          <strong>Email для ответа:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Телефон для связи:</strong>{" "}
          <a href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Получено:</strong> {formatDate(message.createdAt)}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? "bg-gray-300" : "bg-blue-500 text-white"
        } py-1 px-3 rounded-md`}
      >
        {isRead ? "Сделать новым" : "Прочитано"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Удалить
      </button>
    </div>
  );
};

export default Message;
