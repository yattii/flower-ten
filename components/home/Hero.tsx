// components/Hero.tsx
"use client";
import { HeroSlider } from "./HeroSlider";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";

const heroImages = [
  { src: "/images/hero1.png", alt: "季節の花束" },
  { src: "/images/hero2.png", alt: "ショップ外観" },
  { src: "/images/hero3.jpg", alt: "アレンジメント" },
];

export function Hero() {
  return (
    <section className="relative w-full pt-0">
      <div className="relative w-screen h-[100svh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden">
        {/* 背景スライダー */}
        <HeroSlider images={heroImages} intervalMs={3500} />

        {/* キャッチ+花背景レイヤー */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {/* 花の背景（CSSだけで作成） */}
          <div
            className="
              absolute z-0 pointer-events-none
              w-44 h-44 md:w-56 md:h-56
              opacity-80
            "
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-20 h-20 md:w-24 md:h-24 bg-pink-300/60 rounded-full blur-[0.5px]"
                style={{
                  top: "50%",
                  left: "50%",
                  // 中心に合わせてから回転→半径方向へ平行移動
                  transform: `translate(-50%,-50%) rotate(${i * 60}deg) translate(70px)`,
                  transformOrigin: "center",
                }}
              />
            ))}
            {/* 中央の花芯 */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 bg-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md" />
          </div>

          {/* テキストは花より前面に */}
          <div className="relative z-10 text-shadow-lg">
            <h1 className="font-serif text-white drop-shadow-md text-4xl md:text-5xl font-semibold tracking-tight">
              Flower − TEN
            </h1>
            <h2 className="font-serif text-white drop-shadow-md text-xl md:text-2xl font-semibold tracking-tight">
              想いをお花に乗せて
            </h2>
          </div>
        </div>

        {/* スクロール誘導 */}
        <a
          href="#catalog"
          aria-label="下へスクロール（カタログへ）"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white"
        >
          <span className="text-xs tracking-wide opacity-80">Scroll</span>
          <HiOutlineChevronDoubleDown className="h-10 w-10 animate-bounce text-white" />
        </a>
      </div>
    </section>
  );
}
