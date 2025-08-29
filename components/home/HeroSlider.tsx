// components/HeroSlider.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Slide = { src: string; alt?: string };

type Props = {
  images: Slide[];
  intervalMs?: number; // 自動再生間隔（ms）
};

export function HeroSlider({ images, intervalMs = 3500 }: Props) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);       // ドラッグ中の移動量(px)
  const [dragging, setDragging] = useState(false);
  const [isSwiping, setIsSwiping] = useState<boolean | null>(null); // 縦スクロールor横スワイプの判定
  const startX = useRef(0);
  const startY = useRef(0);
  const widthRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const go = (i: number) => setIdx((i + images.length) % images.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  // 自動再生（可視状態のみ）
  useEffect(() => {
    const play = () => {
      stop();
      timerRef.current = window.setInterval(() => setIdx((v) => (v + 1) % images.length), intervalMs);
    };
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    play();
    const onVis = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [images.length, intervalMs]);

  // タッチ開始
  const onTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    widthRef.current = trackRef.current.clientWidth;
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    setDragging(true);
    setIsSwiping(null);
    setDragX(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // タッチ移動
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    // まだ判定していないなら、横/縦のどちらかを判定
    if (isSwiping === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        setIsSwiping(Math.abs(dx) > Math.abs(dy)); // 横のほうが大きければスワイプ
      } else {
        return;
      }
    }

    if (isSwiping) {
      // 横スワイプ：ページのスクロールは止める
      e.preventDefault();
      setDragX(dx);
    }
  };

  // タッチ終了
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);

    // スワイプ判定：幅の 15% 以上動いたらページング
    const threshold = (widthRef.current || 1) * 0.15;
    if (isSwiping && Math.abs(dragX) > threshold) {
      dragX < 0 ? next() : prev();
    }
    setDragX(0);
    setIsSwiping(null);

    // 再び自動再生を開始
    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => setIdx((v) => (v + 1) % images.length), intervalMs);
    }
  };

  // ドットで直接移動
  const goDot = (i: number) => setIdx(i);

  // トラックの transform 計算
  const offsetPercent = -idx * 100;
  const dragPercent =
    widthRef.current > 0 ? (dragX / widthRef.current) * 100 : 0;

  return (
    <div className="relative w-full h-full" ref={trackRef}>
      {/* スライドトラック（横並び） */}
      <div
        className={`absolute inset-0 flex touch-pan-y select-none`}
        style={{
          transform: `translate3d(${offsetPercent + dragPercent}%, 0, 0)`,
          transition: dragging ? "none" : "transform 450ms cubic-bezier(.22,.8,.22,1)",
          willChange: "transform",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* ドット（SPでタップしやすいサイズ） */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 md:gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goDot(i)}
            aria-label={`スライド${i + 1}`}
            className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition
              ${i === idx ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>

      {/* 左右ボタン（任意：PCで使いやすく） */}
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-2">
        <button
          aria-label="前へ"
          onClick={prev}
          className="rounded-full bg-white/80 backdrop-blur border shadow px-3 py-2 hover:bg-white"
        >
          ←
        </button>
        <button
          aria-label="次へ"
          onClick={next}
          className="rounded-full bg-white/80 backdrop-blur border shadow px-3 py-2 hover:bg-white"
        >
          →
        </button>
      </div>
    </div>
  );
}
