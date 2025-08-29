// components/PricingGrid.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PiMedalFill } from "react-icons/pi";

export type Category = { id: string; name: string; order?: number };

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;          // カード用メイン画像
  images?: string[];      // 追加画像（任意）
  description?: string;
  description2?: string;  // 詳細説明（任意）
  rank?: number;          // ★ ランキング（1,2,3…）任意
  categories?: Category[];
};

type Props = {
  products: Product[];
  onPick?: (id: string) => void; // 「このカタログ番号を選ぶ」
};

type SliderStyle = React.CSSProperties & { ["--gap"]?: string };


export default function PricingGrid({ products, onPick }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Product | null>(null);

  const scrollByCards = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <>
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
  className="mt-4 mb-4 snap-start shrink-0 overflow-hidden rounded-3xl bg-white/80 backdrop-blur
             ring-1 ring-black/5 shadow-md transition hover:shadow-xl hover:-translate-y-0.5
             flex flex-col cursor-pointer
             flex-none basis-[33.333%] sm:basis-[48%] lg:basis-[32%]"   // ★ 幅を固定（SP=3/SM=2/LG=3）
  onClick={() => setActive(p)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(p)}
>
  {/* 画像：4:3を強制（プラグイン不要） */}
  <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
    <Image
      src={p.image}
      alt={p.name}
      fill
      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 33vw"
      className="object-cover"
      priority={false}
    />
  </div>

  {/* 本文：最小高を固定して全カードの高さを揃える */}
  <div className="p-2 sm:p-3 lg:p-4 grid gap-1 sm:gap-2 flex-1
                  [grid-template-rows:auto_auto_1fr_auto_auto] min-h-[150px] sm:min-h-[170px]">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-xs sm:text-sm lg:text-base truncate">{p.name}</h3>
      <span className="text-[10px] sm:text-xs bg-gray-100 rounded px-1.5 py-0.5">CAT #{p.id}</span>
    </div>

    {!!p.categories?.length && (
      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-600 h-5 sm:h-6 overflow-hidden">
        {p.categories.map((c) => (
          <span key={c.id} className="rounded-full bg-gray-100 px-1.5 py-0.5 whitespace-nowrap">
            {c.name}
          </span>
        ))}
      </div>
    )}

    <p className="text-[11px] sm:text-sm text-gray-600 line-clamp-2 min-h-[2.8em]">
      {p.description ?? ""}
    </p>

    <p className="text-sm sm:text-base lg:text-lg font-bold mt-auto">¥{p.price.toLocaleString()}</p>
  </div>
</article>

))}

        </div>

        {/* PC の左右ボタン */}
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

      {/* ===== モーダル ===== */}
      {active && (
        <ProductModal
          product={active}
          onClose={() => setActive(null)}
          onPick={(id) => {
            onPick?.(id);
            setActive(null);
            document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}

function ProductModal({
  product,
  onClose,
  onPick,
}: {
  product: Product;
  onClose: () => void;
  onPick?: (id: string) => void;
}) {
  const imgs = product.images?.length ? product.images : [product.image];
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v - 1 + imgs.length) % imgs.length);
  const next = () => setI((v) => (v + 1) % imgs.length);

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full rounded-3xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 画像 */}
        <div className="relative aspect-[4/3] bg-gray-50">
          <Image
            key={imgs[i]}
            src={imgs[i]}
            alt={product.name}
            fill
            sizes="(min-width:768px) 50vw, 100vw"
            className="object-cover transition-opacity duration-300"
            priority
          />
          {imgs.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border px-3 py-2 shadow hover:cursor-pointer"
                aria-label="前の画像"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border px-3 py-2 shadow hover:cursor-pointer"
                aria-label="次の画像"
              >
                →
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {imgs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={`h-2.5 w-2.5 rounded-full ${idx === i ? "bg-gray-900" : "bg-gray-300"}`}
                    aria-label={`画像${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* テキスト */}
        <div className="p-5 md:p-6 grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border px-3 py-1.5 text-sm hover:cursor-pointer"
              aria-label="閉じる"
            >
              閉じる
            </button>
          </div>

          {product.description2 ? (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description2}</p>
          ) : (
            <p className="text-sm text-gray-500">詳細説明は準備中です。</p>
          )}

          {onPick && (
            <button onClick={() => onPick(product.id)} className="mt-2 btn-primary hover:cursor-pointer">
              このカタログ番号を選ぶ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
