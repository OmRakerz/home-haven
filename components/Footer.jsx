"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTelegram, FaVk, FaGithub } from "react-icons/fa";
import logo from "@/assets/images/logo.png";

const Footer = () => {
  const [mounted, setMounted] = useState(false);

  // Чтобы избежать ошибок SSR, устанавливаем mounted при монтировании
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Лого и описание */}
          <div>
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image src={logo} alt="HomeHaven Logo" width={32} height={32} />
              <span className="hidden md:block text-xl font-bold text-gray-800 ml-2">
                HomeHaven
              </span>
            </Link>
            <p className="mt-2 text-gray-600 md:mt-3">
              Дом, в который хочется вернуться
            </p>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Контакты
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:supportHomeHaven@gmail.ru"
                  className="text-gray-600 hover:text-blue-600"
                >
                  supportHomeHaven@gmail.ru
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600">
                  Свяжитесь с нами
                </a>
              </li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Мы в соцсетях
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://t.me/Grandeburik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Telegram"
              >
                <FaTelegram size={24} />
              </a>
              <a
                href="https://vk.com/goldenstuff08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                aria-label="VK"
              >
                <FaVk size={24} />
              </a>
              <a
                href="https://github.com/OmRakerz "
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HomeHaven. Все права защищены.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Автор{" "}
            <a
              href="https://github.com/OmRakerz "
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Three V's
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
