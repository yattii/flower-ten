// components/home/Header.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
// Header.tsx の先頭など
import { Menu, X } from "lucide-react";


export function Header() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const onDocked = () => setShowLogo(true);
    window.addEventListener("intro:docked", onDocked as any, { once: true });
    return () => window.removeEventListener("intro:docked", onDocked as any);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <input id="nav-toggle-main" type="checkbox" className="peer sr-only" />

      {/* ===== PCバー ===== */}
      <div className="hidden md:block bg-white/85 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-16 flex items-center justify-between">
            {/* 受け皿（PC）：画像と同サイズにする（70x30） */}
            <div id="pc-logo-slot" className="flex items-center w-[50px] h-[10px]">
              <a
                id="pc-logo-img"
                href="#top"
                className={`transition-opacity duration-200 ${
                  showLogo ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={showLogo ? undefined : true}
              >
                <Image src="/images/hana-logo.png" alt="HANA" width={50} height={10} priority />
              </a>
            </div>

            <nav className="flex items-center gap-7 text-sm font-semibold text-gray-700">
              <a href="#catalog">ラインナップ</a>
              <a href="#qa">Q&A</a>
              <a href="#order">申し込み</a>
            </nav>
          </div>
        </div>
      </div>

   {/* ===== SP：左上に常設ロゴ（受け皿） ===== */}
<div
  id="sp-logo-slot"
  className="md:hidden pointer-events-none fixed left-4 z-[55]
             opacity-100 transition-opacity duration-200
             peer-checked:opacity-0"
  style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
>
  <a
    id="sp-logo-img"
    href="#top"
    className={`inline-block transition-opacity duration-200 ${
      showLogo ? "opacity-100 pointer-events-auto" : "opacity-0"
    }`}
    aria-hidden={showLogo ? undefined : true}
    style={{ pointerEvents: showLogo ? "auto" : "none" }}
  >
    <div className="bg-[#f5f5dc] rounded-4xl px-2 py-1 shadow-sm">
      <Image
        src="/images/hana-logo.png"
        alt="HANA"
        width={70}
        height={30}
        priority
      />
    </div>
  </a>
</div>


      {/* ===== SPハンバーガー ===== */}
      <label
  htmlFor="nav-toggle-main"
  aria-label="メニューを開閉"
  className="
    md:hidden fixed right-4 top-4 z-[60]
    h-12 w-12 rounded-2xl  backdrop-blur
    border border-black/10 shadow-lg
    flex items-center justify-center
    cursor-pointer select-none
    transition
    hover:shadow-xl hover:-translate-y-0.5
    active:translate-y-0
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/60

    /* アイコンの切替（peer は #nav-toggle-main チェックボックス） */
    peer-checked:[&_.icon-burger]:hidden
    peer-checked:[&_.icon-close]:inline
  "
>
  {/* ハンバーガー */}
  <Menu className="icon-burger inline h-[26px] w-[26px]" strokeWidth={2} aria-hidden="true" />

  {/* クローズ（初期は非表示） */}
  <X className="icon-close hidden h-[26px] w-[26px]" strokeWidth={2} aria-hidden="true" />
</label>


      <label
        htmlFor="nav-toggle-main"
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-40 bg-black/40 opacity-0 pointer-events-none
                   transition-opacity duration-300 ease-out
                   peer-checked:opacity-100 peer-checked:pointer-events-auto"
      />

<aside
  role="dialog" aria-modal="true"
  className="md:hidden fixed inset-0 z-50 bg-white/70 backdrop-blur
             -translate-y-full opacity-0 transition-[opacity,transform] duration-300 ease-out
             will-change-transform peer-checked:translate-y-0 peer-checked:opacity-100 overflow-y-auto"
>
  <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-h-dvh flex">
    <nav className="mx-auto w-full max-w-[680px] flex flex-col items-center justify-center gap-2 py-10 text-base font-medium">
      {/* ▼ ここをテキストからロゴへ差し替え */}
      <a
        href="#top"
        data-close-on-click
        className="px-6 py-3  flex justify-center bg-[#f5f5dc]/50 rounded-4xl"
        aria-label="トップへ"
      >
        <Image
          src="/images/hana-logo.png"
          alt="HANA"
          width={140}   // ← メニュー内は少し大きめ（お好みで調整OK）
          height={60}
          priority
        />
      </a>

      <a href="#catalog" data-close-on-click className="px-6 py-3 w-full text-center">ラインナップ</a>
      <a href="#qa"      data-close-on-click className="px-6 py-3 w-full text-center">Q&A</a>
      <a href="#order"   data-close-on-click className="px-6 py-3 w-full text-center">申し込み</a>
      <a href="tel:0120-000-000" data-close-on-click className="btn-primary mt-2 w-[min(280px,90%)]">📞 0120-000-000</a>
    </nav>
  </div>
</aside>


      <InlineNavScript />
    </header>
  );
}

function InlineNavScript() {
  useEffect(() => {
    const cb = document.getElementById('nav-toggle-main') as HTMLInputElement | null;
    const links = Array.from(document.querySelectorAll('[data-close-on-click]'));
    const lockScroll = (locked: boolean) => { document.documentElement.style.overflow = locked ? 'hidden' : ''; };
    const sync = () => { if (!cb) return; lockScroll(cb.checked); };
    cb?.addEventListener('change', sync);
    sync();
    links.forEach(el => el.addEventListener('click', () => { if (cb) { cb.checked = false; sync(); } }));
    // イントロ完了で必ず解除
    const onDocked = () => { if (cb) { cb.checked = false; } lockScroll(false); };
    window.addEventListener('intro:docked', onDocked as any, { once: true });
    return () => {
      cb?.removeEventListener('change', sync);
      window.removeEventListener('intro:docked', onDocked as any);
      lockScroll(false);
    };
  }, []);
  return null;
}
