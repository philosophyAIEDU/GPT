import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "입시 정보 큐레이션 도우미",
  description: "고등학생을 위한 입시 정보 큐레이션 + 질문 응답 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="text-slate-900 antialiased">{children}</body>
    </html>
  );
}
