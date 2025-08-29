// app/layout.tsx
import "./globals.css";
import { Noto_Sans_JP, Noto_Serif_JP, Great_Vibes } from "next/font/google";

const sans = Noto_Sans_JP({ subsets: ["latin"], weight: ["400","500"], variable: "--font-sans-jp" });
const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["400","700"], variable: "--font-serif-jp" });
const script = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-script" });

export const metadata = {
  title: "花屋 | HANA",
  description: "地域の花屋｜ブーケ・アレンジメント・スタンド花のご注文",
};

// ★ これを追加（スマホで正しい拡大率に）
export const viewport = {
  width: "device-width",
  initialScale: 1,
  // 下はお好み（ピンチ拡大を許可したいなら消す）
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${sans.variable} ${serif.variable} ${script.variable}`}>
      <body className="min-h-screen bg-white text-gray-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
