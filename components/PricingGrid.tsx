// components/PricingGrid.tsx
"use client";

import { useRef, useCallback, KeyboardEvent } from "react";
import Image from "next/image";

export type Category = { id: string; name: string };
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  categories?: Category[];
};

type Props = {
  products: Product[];
  onPick?: (id: string) => void;
};

// CSS カスタムプロパティを使うときの型
type SliderStyle = React.CSSProperties & { ["--gap"]?: string };

export default function PricingGrid({ products, onPick }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = useCallback((dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards("next");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards("prev");
    }
  };

  return (
    <div className="relative">
      {/* 横スクロールスライダー */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-1 no-scrollbar"
        style={{ scrollBehavior: "smooth", ["--gap"]: "1rem" } as SliderStyle}
        aria-label="商品スライダー"
        role="region"
        tabIndex={0}
        onKeyDown={onKey}
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="
              card snap-start shrink-0 overflow-hidden
              transition hover:shadow-xl hover:-translate-y-0.5
              card-w
              min-w-[86%] sm:min-w-[48%] lg:min-w-[32%]" /* card-wは幅計算の補助。min-wは保険 */
          >
            {/* 画像 */}
            <div className="relative aspect-[4/3]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 86vw"
                className="object-cover"
                priority={false}
              />
            </div>

            {/* 本文ブロック */}
            <div className="p-4 grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-tight text-gray-900">
                  {p.name}
                </h3>
                <span className="chip text-xs">CAT #{p.id}</span>
              </div>

              {!!p.categories?.length && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {p.categories.map((c) => (
                    <span key={c.id} className="chip">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}

              {p.description && (
                <p className="text-sm text-gray-700">
                  {p.description}
                </p>
              )}

              <p className="mt-2 text-xl font-serif font-semibold text-gray-900">
                ¥{p.price.toLocaleString()}
              </p>

              {onPick && (
                <button
                  onClick={() => onPick(p.id)}
                  className="mt-2 btn-secondary text-sm"
                  aria-label={`${p.name} を選択`}
                >
                  このカタログ番号を選ぶ
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 左右ナビ（PC表示） */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden sm:block">
        <div className="h-full flex items-center justify-between">
          <button
            onClick={() => scrollByCards("prev")}
            className="pointer-events-auto ml-1 rounded-full border bg-white/90 px-3 py-2 shadow"
            aria-label="前へ"
            type="button"
          >
            ←
          </button>
          <button
            onClick={() => scrollByCards("next")}
            className="pointer-events-auto mr-1 rounded-full border bg-white/90 px-3 py-2 shadow"
            aria-label="次へ"
            type="button"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
