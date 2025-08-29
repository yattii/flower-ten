// components/home/IntroSplashImage.tsx
"use client";
import { useEffect, useRef, useState } from "react";

// イントロの拡大率（見た目の大きさ）
const START_SCALE = 4;

export function IntroSplash() {
  const [show, setShow] = useState(true);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const prevOverflow = document.documentElement.style.overflow;
    const lock = () => { document.documentElement.style.overflow = "hidden"; };
    const unlock = () => { document.documentElement.style.overflow = prevOverflow; };
    lock();

    // 全画面オーバーレイ（入力を奪わない）
    const host = document.createElement("div");
    hostRef.current = host;
    Object.assign(host.style, {
      position: "fixed", inset: "0", zIndex: "70", pointerEvents: "none",
    } as CSSStyleDeclaration);
    document.body.appendChild(host);

    // 中央ロゴ（size はターゲットに合わせて後から設定）
    const img = document.createElement("img");
    img.src = "/images/hana-logo.svg"; // SVG/PNG どちらでも
    Object.assign(img.style, {
      position: "absolute",
      left: "50%", top: "50%",
      transform: `translate(-50%,-50%) scale(${START_SCALE})`,
      transformOrigin: "center",
      opacity: "0",
    } as CSSStyleDeclaration);
    host.appendChild(img);

    function pickTarget() {
      const isPC = window.matchMedia?.("(min-width: 768px)")?.matches; // md ブレークポイント
      if (isPC) {
        return (
          document.getElementById("pc-logo-img") ??
          document.getElementById("pc-logo-slot") ??
          null
        );
      } else {
        return (
          document.getElementById("sp-logo-img") ??
          document.getElementById("sp-logo-slot") ??
          null
        );
      }
    }

    function finish() {
      const cb = document.getElementById("nav-toggle-main") as HTMLInputElement | null;
      if (cb) cb.checked = false;
      window.dispatchEvent(new Event("intro:docked")); // ヘッダーに表示指示
      unlock();
      cleanup();
    }
    function cleanup() {
      hostRef.current?.remove();
      hostRef.current = null;
      setShow(false);
    }

    const start = () => {
      // 目標の矩形を取得（SP/PCで分岐）
      const target = pickTarget();
      const toRect =
        target?.getBoundingClientRect() ??
        ({ left: 16, top: 16, width: 70, height: 30 } as DOMRect);

      // 画像サイズを着地点に合わせる（scale(START_SCALE)で大きく“見せる”）
      img.width = Math.round(toRect.width);
      img.height = Math.round(toRect.height);

      // ① 中央で 2s フェードイン（拡大状態のまま）
      const hold = img.animate(
        [
          { opacity: 0, transform: `translate(-50%,-50%) scale(${START_SCALE})` },
          { opacity: 1, transform: `translate(-50%,-50%) scale(${START_SCALE})` },
        ],
        { duration: 2000, easing: "ease-out", fill: "forwards" }
      );

      hold.onfinish = () => {
        if (reduce) { finish(); return; }

        // ② 1s で着地点の中心へ移動しつつ、scale(1) まで縮小
        const fromRect = img.getBoundingClientRect(); // 現在の中央位置
        const dx = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
        const dy = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

        img.animate(
          [
            { transform: `translate(-50%,-50%) scale(${START_SCALE})`, opacity: 1 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 1 },
          ],
          { duration: 1000, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
        ).onfinish = finish;
      };
    };

    // 1フレーム待ってから開始（座標安定）
    requestAnimationFrame(start);

    // 途中でリサイズ/回転されたら即終了して設置（ズレ防止）
    const onResize = () => finish();
    window.addEventListener("resize", onResize, { once: true });

    return () => {
      window.removeEventListener("resize", onResize);
      unlock();
      cleanup();
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[65] pointer-events-none">
      {/* 背景：2秒後から1秒かけてフェードアウト */}
      <div className="absolute inset-0 bg-[#f5f5dc] animate-[introBgFade_2s_ease-out_2s_forwards]" />
    </div>
  );
}
