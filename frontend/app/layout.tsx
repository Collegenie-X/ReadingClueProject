import type { Metadata, Viewport } from "next";
import "./globals.css";
import Gnb from "@/components/Gnb";
import MobileTabBar from "@/components/MobileTabBar";
import { ToastHost } from "@/components/ui";

export const metadata: Metadata = {
  title: "ReadingClue — 관심사를 정하고, 연관된 책을 읽고, 기획안을 남깁니다",
  description:
    "무조건 읽으라고 하지 않습니다. 관심사 50개 중 내 것을 먼저 정하고, 그 관심사와 연관된 책을 비판적으로 읽어 질문을 만들고, 기획안까지 씁니다. 독서 지도자를 위한 온라인 독서 실행 플랫폼.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <Gnb />
        <main className="pb-tabbar min-h-[calc(100vh-72px)]">{children}</main>
        <MobileTabBar />
        <ToastHost />
      </body>
    </html>
  );
}
