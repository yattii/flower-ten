"use client";
import PricingGrid from "@/components/PricingGrid";
import type { Product, Category } from "@/lib/types";


export function CatalogSection({
  products, categories, selectedCat, setSelectedCat, onPick,
}: {
  products: Product[];
  categories: Category[];
  selectedCat: string;
  setSelectedCat: (v: string) => void;
  onPick?: (id: string) => void;
}) {
  const sorted = [...(categories ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const toArr = (v: Category[] | Category | undefined | null): Category[] => (Array.isArray(v) ? v : v ? [v] : []);
  const filtered = selectedCat === "all" ? products : products.filter((p) => toArr(p.categories).some((c) => c.id === selectedCat));

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="section-title text-gray-900">ラインナップ</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip label="すべて" active={selectedCat === "all"} onClick={() => setSelectedCat("all")} />
        {sorted.map((c) => (
          <FilterChip key={c.id} label={c.name} active={selectedCat === c.id} onClick={() => setSelectedCat(c.id)} />
        ))}
      </div>
      <PricingGrid products={filtered} onPick={onPick} />
    </section>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`chip ${active ? "chip-active" : ""} text-gray-900`}>{label}</button>;
}
