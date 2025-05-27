"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toastSuccess, toastError } from "@/components/Toasts";
import { useGlobalContext } from "@/context/GlobalContext";
import MessageImages from "./MessageImages";

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
          toastSuccess("Прочитано");
        }
      }
    } catch (error) {
      console.log(error);
      toastError("Что-то пошло не так");
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
        toastSuccess("Сообщение удалено");
      }
    } catch (error) {
      console.log(error);
      toastError("Сообщение не было удалено");
    }
  };

  if (isDeleted) return null;

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleString("ru-RU", options);
  };

  const formatTelegramMentions = (text) => {
    if (!text) return text;

    // Регулярное выражение для поиска @username
    const regex = /@(\w+)/g;

    // Разбиваем текст на части: обычный текст и упоминания
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Добавляем текст до упоминания
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Получаем имя пользователя
      const username = match[1];

      // Создаём ссылку
      parts.push(
        <a
          key={match.index}
          href={`https://t.me/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          @{username}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Добавляем остаток текста после последнего упоминания
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      {/* Метка "Новое" */}
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md z-10">
          Новое
        </div>
      )}

      <h2 className="text-xl mb-4">
        <span className="font-bold">Вопрос по объекту:</span>{" "}
        <Link
          href={`/properties/${message.property._id}`}
          className="text-blue-500 hover:underline"
        >
          {message.property.name}
        </Link>
      </h2>

      <p className="text-gray-700 whitespace-pre-line">
        {formatTelegramMentions(message.body)}
      </p>

      {/* Информация об отправителе и слайдер рядом */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
        {/* Левая часть: информация о пользователе */}
        <div className="md:w-1/2">
          <ul>
            <li className="mt-2">
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
        </div>

        {/* Правая часть: слайдер с изображениями */}
        <div className="md:w-1/2">
          <MessageImages images={message.property?.images || []} compact />
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleReadClick}
          className={`py-1 px-3 rounded-md ${
            isRead ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          {isRead ? "Сделать новым" : "Прочитано"}
        </button>
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white py-1 px-3 rounded-md"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default Message;
