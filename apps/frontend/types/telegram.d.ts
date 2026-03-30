export {}

declare global {
  interface TelegramWebApp {
    colorScheme: "light" | "dark";
    initData: string;
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
