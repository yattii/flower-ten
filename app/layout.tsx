// app/layout.tsx
import "./globals.css"; // ← これが無いとTailwindが効きません

export const metadata = {
  title: "花屋 | HANA",
  description: "地域の花屋｜ブーケ・アレンジメント・スタンド花のご注文",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
