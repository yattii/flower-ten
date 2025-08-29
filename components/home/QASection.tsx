"use client";
import { type ReactNode } from "react";

const FAQS: { q: string; a: ReactNode }[] = [
  { q: "最短どれくらいで届けられますか？当日対応は可能ですか？",
    a: <p>在庫状況とお届け先により異なりますが、<strong>店頭在庫での当日手配</strong>もご相談可能です。お急ぎの際はまずお電話（<a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a>）でご希望の時間・エリアをお知らせください。</p> },
  { q: "支払い方法は？領収書やインボイスは発行できますか？", a: <p>現金・クレジット・振込対応。<strong>領収書・インボイス</strong>発行可。</p> },
  { q: "配達エリアと配送料を教えてください。", a: <p>近隣は自社便、遠方は提携便。<strong>距離・サイズで変動</strong>します。</p> },
  { q: "色や雰囲気の指定はできますか？カタログ外も注文可能？", a: <p>可能です。<strong>色味・用途・予算</strong>をご記入ください。</p> },
  { q: "キャンセルや変更はできますか？", a: <p>仕入れ状況により変動。<strong>早めのご連絡</strong>をお願いします。</p> },
  { q: "電話だけで申込みできますか？", a: <p>はい、可能です。<a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a> で承ります。</p> },
];

export function QASection() {
  return (
    <section id="qa" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="section-title text-gray-900 pt-11">よくあるご質問</h2>
      <div className="mt-6 grid gap-3">
        {FAQS.map((f, i) => (
          <details key={i} className="group rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-sm open:shadow-md">
            <summary className="list-none cursor-pointer px-5 py-4 flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-sky-400 text-white text-xs font-semibold">Q</span>
              <span className="font-medium text-gray-900">{f.q}</span>
              <span className="ml-auto text-gray-500">⌄</span>
            </summary>
            <div className="px-5 pb-5 text-gray-700">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
