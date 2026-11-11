import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manage Product App",
  description: "ระบบจัดการสินค้า",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-black">
        {children}
      </body>
    </html>
  );
}
