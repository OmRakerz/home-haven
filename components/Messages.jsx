"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import Message from "@/components/Message";
import { FaMessage } from "react-icons/fa6";
import Pagination from "@/components/Pagination";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) throw new Error("Ошибка загрузки сообщений");

        const data = await res.json();
        console.log("Полученные сообщения:", data);
        setMessages(data);
      } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, []);

  const totalPages = Math.ceil(messages.length / pageSize);
  const paginatedMessages = messages.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (loading) return <Spinner loading={loading} />;

  return (
    <section className="bg-blue-50 flex-1">
      <div className="container m-auto py-8 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">
            Ваши сообщения <FaMessage className="text-3xl mx-2 inline-block" />
          </h1>

          {paginatedMessages.length === 0 ? (
            <p>У вас нет сообщений</p>
          ) : (
            <div className="space-y-4">
              {paginatedMessages.map((message) => (
                <Message key={message._id} message={message} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={messages.length}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;
