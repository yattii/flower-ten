"use client";
import { HeroSlider } from "./HeroSlider";

const heroImages = [
  { src: "/images/hero1.png", alt: "季節の花束" },
  { src: "/images/hero2.png", alt: "ショップ外観" },
  { src: "/images/hero3.png", alt: "アレンジメント" },
];

export function Hero() {
  return (
    <section className="relative w-full pt-0">
      <div className="relative w-screen h-[100svh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden shadow-xl ring-1 ring-black/5">
        <HeroSlider images={heroImages} intervalMs={3500} />
        <div className="absolute bottom-0 md:bottom-8 left-0 right-0 md:left-8 md:max-w-xl p-4 md:p-0">
          <div className="bg-white/90 backdrop-blur-sm rounded-t-2xl md:rounded-2xl p-5 md:p-6 shadow-lg ring-1 ring-black/5">
            <h1 className="font-serif text-[22px] md:text-4xl font-semibold tracking-tight text-gray-900">想いを花にのせて</h1>
            <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">ブーケ・アレンジメント・スタンド花｜即日手配もご相談ください</p>
            <div className="mt-4 flex gap-3">
              <a href="#catalog" className="btn-primary">カタログを見る</a>
              <a href="#order" className="btn-secondary">見積り・ご相談</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
