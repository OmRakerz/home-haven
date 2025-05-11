"use client";
import { createContext, useContext, useState } from "react";

// Создаем контекст
const GlobalContext = createContext();

// Создание провайдера
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Создание пользовательского хука для доступа к контексту
export function useGlobalContext() {
  return useContext(GlobalContext);
}
