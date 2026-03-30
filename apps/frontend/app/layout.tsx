import type { Metadata } from "next";
import "./globals.css";
import { TelegramTheme } from "@/components/TelegramTheme";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/lib/auth";
import { ApolloWrapper } from "@/lib/apollo";

export const metadata: Metadata = {
  title: "Workout",
  description: "Telegram workout tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col pt-5 pb-25 flex flex-col items-center">
        <AuthProvider>
          <ApolloWrapper>
            <TelegramTheme />
            {children}
            <div className="fixed bottom-5 left-0 right-0 flex justify-center">
              <Footer />
            </div>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
