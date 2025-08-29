// components/home/CatalogSection.tsx
// components/home/CatalogSection.tsx
"use client";

import { useMemo } from "react";
import PricingGrid, { type Product, type Category } from "@/components/PricingGrid";

export function CatalogSection({
  products, categories, selectedCat, setSelectedCat, onPick,
}: {
  products: Product[];
  categories: Category[];
  selectedCat: string;
  setSelectedCat: (v: string) => void;
  onPick?: (id: string) => void;
}) {
  const sortedCats = useMemo(
    () => [...(categories ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [categories]
  );

  const toArr = (v: Category[] | Category | undefined | null): Category[] =>
    Array.isArray(v) ? v : v ? [v] : [];

  // 通常のラインナップ
  const filtered = useMemo(
    () =>
      selectedCat === "all"
        ? products
        : products.filter((p) => toArr(p.categories).some((c) => c.id === selectedCat)),
    [products, selectedCat]
  );
// ランキング（rank が入っているものだけ昇順）
const popular = useMemo(
  () => products
    .filter((p) => typeof p.rank === "number")
    .sort((a, b) => (a.rank! - b.rank!)),
  [products]
);

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-14">
      {/* ===== ラインナップ ===== */}
<h2 className="section-title text-gray-900 pt-11 pb-4">ラインナップ</h2>

<div className="mb-6 flex flex-wrap gap-2">
  <button
    type="button"
    onClick={() => setSelectedCat("all")}
    className={`chip ${selectedCat === "all" ? "chip-active" : ""} text-gray-900`}
  >
    すべて
  </button>

  {sortedCats.map((c) => (
    <button
      key={c.id}
      type="button"
      onClick={() => setSelectedCat(c.id)}
      className={`chip ${selectedCat === c.id ? "chip-active" : ""} text-gray-900`}
    >
      {c.name}
    </button>
  ))}
</div>

<PricingGrid products={filtered} onPick={onPick} />


      {/* ===== 今人気の商品 ===== */}
{popular.length > 0 && (
  <div className="mt-16">
    <h2 className="section-title text-gray-900">今人気の商品</h2>
    <PricingGrid products={popular} onPick={onPick} />
  </div>
)}
    </section>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`chip ${active ? "chip-active" : ""} text-gray-900`}>
      {label}
    </button>
  );
}
