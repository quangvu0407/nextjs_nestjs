import type { Metadata } from "next";
import HeaderPage from "@/components/homePage/header";
import FooterPage from "@/components/homePage/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodApp",
  description: "Đặt món ngon từ các nhà hàng yêu thích",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <HeaderPage />
        <main style={{ flex: 1 }}>{children}</main>
        <FooterPage />
      </body>
    </html>
  );
}
