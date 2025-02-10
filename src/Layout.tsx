"use client"
import "./globals.css";
import ReduxProvider from "../feature/provider/ReduxProvider";
import "react-toastify/dist/ReactToastify.css";


interface LayoutProps {
  children: React.ReactNode;
}
export default function SpecificPageLayout({ children }: LayoutProps) {
  return (
    <ReduxProvider > 
      <main className="">
        {children}
      </main>
    </ReduxProvider>
  );
}
