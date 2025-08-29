// components/PricingGrid.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Product, Category } from "@/lib/types"; // ← 型は lib/types だけを見る
export type { Product, Category } from "@/lib/types";  // ← 便宜的に再エクスポート（任意）

type Props = {
  products: Product[];
  onPick?: (id: string) => void;
};

// CSS カスタムプロパティを使うときの型
type SliderStyle = React.CSSProperties & { ["--gap"]?: string };

export default function PricingGrid({ products, onPick }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-1 no-scrollbar"
        style={{ scrollBehavior: "smooth", ["--gap"]: "1rem" } as SliderStyle}
        aria-label="商品スライダー"
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="snap-start shrink-0 overflow-hidden rounded-3xl bg-white/80 backdrop-blur
                       ring-1 ring-black/5 shadow-md transition
                       hover:shadow-xl hover:-translate-y-0.5
                       min-w-[86%] sm:min-w-[48%] lg:min-w-[32%]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 86vw"
                className="object-cover"
              />
            </div>

            <div className="p-4 flex-1 grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="text-xs bg-gray-100 rounded px-2 py-1">CAT #{p.id}</span>
              </div>

              {!!p.categories?.length && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {p.categories.map((c: Category) => (
                    <span key={c.id} className="rounded-full bg-gray-100 px-2 py-0.5">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}

              {p.description && <p className="text-sm text-gray-600">{p.description}</p>}

              <p className="text-lg font-bold mt-auto">¥{p.price.toLocaleString()}</p>

              {onPick && (
                <button onClick={() => onPick(p.id)} className="mt-2 rounded-lg border px-4 py-2 text-sm">
                  このカタログ番号を選ぶ
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden sm:block">
        <div className="h-full flex items-center justify-between">
          <button
            onClick={() => scrollByCards("prev")}
            className="pointer-events-auto ml-1 rounded-full border bg-white/90 px-3 py-2 shadow"
            aria-label="前へ"
          >
            ←
          </button>
          <button
            onClick={() => scrollByCards("next")}
            className="pointer-events-auto mr-1 rounded-full border bg-white/90 px-3 py-2 shadow"
            aria-label="次へ"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
