"use client";

import { useEffect } from "react";

export function TelegramTheme() {
  useEffect(() => {

    const tg = window.Telegram?.WebApp;
    if (tg?.colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}