export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        colorScheme?: "light" | "dark"
        initData?: string
      }
    }
  }
}
