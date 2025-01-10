// src/app/layout.tsx
import { Metadata } from "next";
import ReduxProvider from "../../feature/provider/ReduxProvider";
import Navbar from "@/components/nav/Navbar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import MainLayout from "./mainLayout";
import CookieBanner from "@/components/cookie/CookieBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "A & O - Ihre Lösung für Mobilität und Autopflege",
  description: "A & O bietet Ihnen hochwertige Autos zum Kaufen, Mieten und besten Service rund um Fahrzeugpflege und Reparaturen. Entdecken Sie attraktive Angebote, unkomplizierte Buchungen und individuelle Lösungen für jede Mobilitätsanforderung.",
  icons: [
    { rel: "icon", url: "/logo.png", sizes: "32x32", type: "image/png" }, // Standardgröße für Browser-Tab
    { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" }, // Für größere Bildschirme
    { rel: "apple-touch-icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" }, // Für iOS-Geräte
    { rel: "shortcut icon", url: "/favicon.ico", type: "image/x-icon" }, // Fallback für ältere Browser
  ],
};


export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="de">
      <body className="bg-gray-200">
        <ReduxProvider>
          <MainLayout>
            <header>
              <Navbar />
            </header>
            <main>{children}</main>
            <CookieBanner />
            <ToastContainer />
            <footer>
              <Footer />
            </footer>
          </MainLayout>

          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
