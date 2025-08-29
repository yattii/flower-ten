"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function HeroSlider({ images, intervalMs = 3500 }: { images: { src: string; alt?: string }[]; intervalMs?: number }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  const go = (i: number) => setIdx((i + images.length) % images.length);
  const next = () => go(idx + 1);

  useEffect(() => {
    const stop = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
    const play = () => { stop(); timer.current = window.setInterval(next, intervalMs); };
    play();
    const onVis = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, intervalMs]);

  return (
    <div className="relative w-full h-full">
      {images.map((img, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}>
          <Image src={img.src} alt={img.alt ?? ""} fill priority={i === 0} sizes="100vw" className="object-cover bg-white" />
        </div>
      ))}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 md:gap-3">
        {images.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`スライド${i + 1}`} className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition ${i === idx ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"}`} />
        ))}
      </div>
    </div>
  );
}
