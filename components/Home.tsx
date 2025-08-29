// components/Home.tsx（抜粋）
"use client";
import { useState } from "react";
import type { Product, Category } from "@/lib/types";
import { Header } from "@/components/home/Header";
import { IntroSplash } from "@/components/home/IntroSplash";
import { Hero } from "@/components/home/Hero";
import { CatalogSection } from "@/components/home/CatalogSection";
import { QASection } from "@/components/home/QASection";
import { OrderSection } from "@/components/home/OrderSection";
import { Footer } from "@/components/home/Footer";

export default function Home({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [pickedCatalogId, setPickedCatalogId] = useState<string>(""); // ★ 追加

  return (
    <main id="top" className="overflow-x-clip relative text-gray-900">
      <IntroSplash />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_20%_20%,#fff0f6_0%,transparent_60%),radial-gradient(70%_100%_at_80%_20%,#e6f7ff_0%,transparent_60%),linear-gradient(180deg,#ffffff,#fffaf5)]" />
      <Header />
      <Hero />

      <CatalogSection
        products={products}
        categories={categories}
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
        onPick={(pid) => {
          setPickedCatalogId(pid);                            // ★ 選択保持
          document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <QASection />

      {/* OrderSection に商品一覧（id, name）と初期選択を渡す */}
      <OrderSection
        products={products.map((p) => ({ id: p.id, name: p.name }))}
        initialCatalogId={pickedCatalogId}
      />

      <Footer />
    </main>
  );
}

// git status                    
// git add .                       
// git commit -m "Fix something"  
// git push