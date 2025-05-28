"use client";
import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";
import profileDefault from "@/assets/images/profile.png";
import {
  FaGoogle,
  FaYandex,
  FaGithub,
  FaUser,
  FaSignOutAlt,
  FaBookmark,
} from "react-icons/fa";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import UnreadMessageCount from "./UnreadMessageCount";

const icons = {
  google: <FaGoogle className="text-lg" />,
  yandex: <FaYandex className="text-lg" />,
  github: <FaGithub className="text-lg" />,
  guest: <FaUser className="text-lg" />,
};

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();
  }, []);

  return (
    <nav className="bg-blue-700 border-b border-blue-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            {/* <!-- Кнопка мобильного меню--> */}
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Открыть главное меню</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Лого --> */}
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-10 w-auto" src={logo} alt="HomeHaven" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                HomeHaven
              </span>
            </Link>
            {/* <!-- Меню рабочего стола скрыто под экранами md --> */}
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${
                    pathname === "/" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  Главная
                </Link>
                <Link
                  href="/properties"
                  className={`${
                    pathname === "/properties" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  Недвижимость
                </Link>
                {session && (
                  <Link
                    href="/properties/add"
                    className={`${
                      pathname === "/properties/add" ? "bg-black" : ""
                    } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                  >
                    Добавить
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* <!-- Правое меню (выход из системы) --> */}
          {!session && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center gap-2">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <React.Fragment key={provider.id}>
                      {/* Кнопка Google / GitHub / Guest */}
                      {provider.id !== "yandex" && (
                        <button
                          onClick={() => signIn(provider.id)}
                          className={`flex items-center justify-center ${
                            provider.id === "guest"
                              ? "text-black bg-yellow-400 hover:bg-yellow-500"
                              : "text-gray-800 bg-gray-200 hover:bg-gray-900 hover:text-white"
                          } rounded-md p-2 group h-10 w-10 hover:w-auto transition-all duration-300 overflow-hidden`}
                        >
                          <span className="group-hover:animate-bounce">
                            {icons[provider.id]}
                          </span>
                          <span className="ml-0 w-0 group-hover:ml-2 group-hover:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                            {provider.id === "guest"
                              ? "Гость"
                              : provider.name === "Google"
                              ? "Google"
                              : "GitHub"}
                          </span>
                        </button>
                      )}

                      {/* Кнопка Яндекс */}
                      {provider.id === "yandex" && (
                        <button
                          onClick={() => signIn(provider.id)}
                          className={`flex items-center justify-center ${
                            provider.id === "yandex"
                              ? "text-white bg-orange-500 hover:bg-orange-600"
                              : "text-gray-800 bg-gray-200 hover:bg-gray-900 hover:text-white"
                          } rounded-md p-2 group h-10 w-10 hover:w-auto transition-all duration-300 overflow-hidden`}
                        >
                          <span className="group-hover:animate-bounce">
                            {icons[provider.id] || <FaYandex />}
                          </span>
                          <span className="ml-0 w-0 group-hover:ml-2 group-hover:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                            {"Яндекс"}
                          </span>
                        </button>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}

          {/* <!-- Правое меню (вход выполнен) --> */}
          {session && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Просмотреть уведомления</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
                <UnreadMessageCount session={session} />
              </Link>
              {/* <!-- Кнопка раскрывающегося списка профиля --> */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Открыть меню пользователя</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={profileImage || profileDefault}
                      alt=""
                      width={200}
                      height={200}
                    />
                  </button>
                </div>

                <div
                  className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-300 ${
                    isProfileMenuOpen
                      ? "opacity-100 scale-y-100"
                      : "opacity-0 scale-y-0"
                  }`}
                  style={{ transformOrigin: "top right" }}
                  id="user-menu"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-0"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Профиль
                  </Link>
                  <Link
                    href="/properties/saved"
                    className="flex items-center px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <FaBookmark className="mr-2" />
                    Закладки
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left"
                    role="menuitem"
                    tabIndex="-1"
                    id="user-menu-item-2"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <!-- Мобильное меню, показывать/скрывать в зависимости от состояния меню. --> */}
      {isMobileMenuOpen && (
        <div id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="/properties"
              className={`${
                pathname === "/properties" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Недвижимость
            </Link>
            {session && (
              <Link
                href="/properties/add"
                className={`${
                  pathname === "/properties/add" ? "bg-black" : ""
                } text-white block rounded-md px-3 py-2 text-base font-medium`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Добавить
              </Link>
            )}

            {!session &&
              providers &&
              Object.values(providers).map((provider) => (
                <React.Fragment key={provider.id}>
                  {/* Google / GitHub / Guest */}
                  {provider.id !== "yandex" && (
                    <button
                      onClick={() => {
                        signIn(provider.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center ${
                        provider.id === "guest"
                          ? "text-black bg-yellow-400 hover:bg-yellow-500"
                          : "text-white bg-gray-700 hover:bg-gray-900"
                      } rounded-md px-3 py-2 w-full`}
                    >
                      {provider.id === "google" ? (
                        <FaGoogle className="mr-2" />
                      ) : provider.id === "github" ? (
                        <FaGithub className="mr-2" />
                      ) : (
                        <FaUser className="mr-2" />
                      )}
                      <span>
                        {provider.id === "guest"
                          ? "Войти как гость"
                          : `Войти через ${provider.name}`}
                      </span>
                    </button>
                  )}

                  {/* Yandex */}
                  {provider.id === "yandex" && (
                    <button
                      onClick={() => {
                        signIn(provider.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center ${
                        provider.id === "yandex"
                          ? "text-white bg-orange-500 hover:bg-orange-600"
                          : "text-white bg-gray-700 hover:bg-gray-900"
                      } rounded-md px-3 py-2 w-full`}
                    >
                      <FaYandex className="mr-2" />
                      <span>Войти через Яндекс</span>
                    </button>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
