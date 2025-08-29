// components/HeroSlider.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Slide = { src: string; alt?: string };
type Props = { images: Slide[]; intervalMs?: number };

export function HeroSlider({ images, intervalMs = 4500 }: Props) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isSwiping, setIsSwiping] = useState<boolean | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false); // PC判定

  const startX = useRef(0);
  const startY = useRef(0);
  const widthRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const go = (i: number) => setIdx((i + images.length) % images.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  // 端末のホバー可否（PC）を判定
  useEffect(() => {
    const isHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    setHoverCapable(isHover);
  }, []);

  // 自動再生（可視時のみ）
  useEffect(() => {
    const play = () => {
      stop();
      timerRef.current = window.setInterval(
        () => setIdx((v) => (v + 1) % images.length),
        intervalMs
      );
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

  // 共通開始（タッチ/マウス）
  const beginDrag = (clientX: number, clientY: number) => {
    if (!trackRef.current) return;
    widthRef.current = trackRef.current.clientWidth;
    startX.current = clientX;
    startY.current = clientY;
    setDragging(true);
    setIsSwiping(null);
    setDragX(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 共通移動（タッチ/マウス）
  const moveDrag = (clientX: number, clientY: number, prevent?: () => void) => {
    if (!dragging) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;

    if (isSwiping === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        setIsSwiping(Math.abs(dx) > Math.abs(dy));
      } else {
        return;
      }
    }
    if (isSwiping) {
      prevent?.(); // スクロール抑制（タッチ時）
      setDragX(dx);
    }
  };

  // 共通終了（タッチ/マウス）
  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = (widthRef.current || 1) * 0.15;
    if (isSwiping && Math.abs(dragX) > threshold) {
      dragX < 0 ? next() : prev();
    }
    setDragX(0);
    setIsSwiping(null);
    if (!timerRef.current) {
      timerRef.current = window.setInterval(
        () => setIdx((v) => (v + 1) % images.length),
        intervalMs
      );
    }
  };

  // タッチイベント
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY, () => e.preventDefault());
  };
  const onTouchEnd = () => endDrag();

  // マウスイベント（PC）
  const onMouseDown = (e: React.MouseEvent) => {
    beginDrag(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    // マウス時はページスクロール関係ないので prevent 不要
    moveDrag(e.clientX, e.clientY);
  };
  const onMouseUp = () => endDrag();
  const onMouseLeave = () => endDrag();

  // ドット移動
  const goDot = (i: number) => setIdx(i);

  // トラック transform
  const offsetPercent = -idx * 100;
  const dragPercent = widthRef.current > 0 ? (dragX / widthRef.current) * 100 : 0;

  return (
    <div className="relative w-full h-full" ref={trackRef}>
      {/* スライドトラック */}
      <div
        className="absolute inset-0 flex touch-pan-y select-none"
        style={{
          transform: `translate3d(${offsetPercent + dragPercent}%, 0, 0)`,
          transition: dragging ? "none" : "transform 450ms cubic-bezier(.22,.8,.22,1)",
          willChange: "transform",
        }}
        // タッチ
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        // マウス
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            <Image
              src={img.src}
              alt={img.alt ?? ""}
              fill
              sizes="100vw"
              className="object-cover select-none pointer-events-none"
              priority={i === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* PC用 透明クリックゾーン（左右ハーフ） */}
      <div className="hidden md:block absolute inset-0 z-20">
        <button
          aria-label="前へ"
          onClick={prev}
          className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
          style={{ background: "transparent" }}
        />
        <button
          aria-label="次へ"
          onClick={next}
          className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
          style={{ background: "transparent" }}
        />
      </div>

      {/* ドット（SP=タップ / PC=ホバー&クリック） */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goDot(i)}
            onMouseEnter={hoverCapable ? () => goDot(i) : undefined}
            aria-label={`スライド${i + 1}`}
            className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full transition
              ${i === idx ? "bg-white/90" : "bg-white/50 hover:bg-white/90"}`}
          />
        ))}
      </div>

      {/* （任意）左右ボタンを残したい場合は z-20 を付けてください
      <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-2 z-20">
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
      */}
    </div>
  );
}
