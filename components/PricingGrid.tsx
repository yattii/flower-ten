// components/PricingGrid.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";

export type Category = { id: string; name: string };
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  /** 元画像の幅/高さがわかる場合は入れてください（わからない場合は未指定でOK） */
  imageW?: number;
  imageH?: number;
  description?: string;
  categories?: Category[];
};

type Props = {
  products: Product[];
  onPick?: (id: string) => void;
};

export default function PricingGrid({ products, onPick }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    // 画面幅の約9割
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* スクロール領域（横並び・スナップ） */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-1 no-scrollbar"
        style={{ scrollBehavior: "smooth", ["--gap" as any]: "1rem" }} // ← gap-4 と同じ 1rem
        aria-label="商品スライダー"
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="card-w snap-start shrink-0 overflow-hidden rounded-3xl bg-white/80 backdrop-blur
                       ring-1 ring-black/5 shadow-md transition
                       hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* 画像：元比率が分かる場合は width/height を使用して自然な高さに */}
            {p.imageW && p.imageH ? (
              <Image
                src={p.image}
                alt={p.name}
                width={p.imageW}
                height={p.imageH}
                // 幅いっぱい、高さは自動（元画像比率のまま）
                className="w-full h-auto object-cover"
                priority={false}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 33vw"
              />
            ) : (
              // フォールバック：4:3 の枠で切り抜き
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            )}

            <div className="p-4 grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span className="text-xs bg-gray-100 rounded px-2 py-1">CAT #{p.id}</span>
              </div>

              {Array.isArray(p.categories) && p.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  {p.categories.map((c) => (
                    <span key={c.id} className="rounded-full bg-gray-100 px-2 py-0.5">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}

              {p.description && <p className="text-sm text-gray-600">{p.description}</p>}

              <p className="text-lg font-bold mt-1">¥{p.price.toLocaleString()}</p>

              {onPick && (
                <button
                  onClick={() => onPick(p.id)}
                  className="mt-2 rounded-lg border px-4 py-2 text-sm"
                >
                  このカタログ番号を選ぶ
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 前後ボタン（必要に応じてスマホでは非表示） */}
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
