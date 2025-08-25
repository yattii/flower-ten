// components/Home.tsx
"use client";

import { useMemo, useState, ReactNode } from "react";
import emailjs from "@emailjs/browser";
import HeroSlider from "@/components/HeroSlider";
import PricingGrid from "@/components/PricingGrid";
import type { Product, Category } from "@/lib/types";

const heroImages = [
  { src: "/images/hero1.png", alt: "季節の花束" },
  { src: "/images/hero2.png", alt: "ショップ外観" },
  { src: "/images/hero3.png", alt: "アレンジメント" },
];

export default function Home({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    catalogId: "",
    quantity: 1,
    preferredTime: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const sortedCategories = useMemo(
    () => [...(categories ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCat === "all") return products;
    const toArr = (v: any) => (Array.isArray(v) ? v : v ? [v] : []);
    return products.filter((p) => toArr(p.categories).some((c: any) => c?.id === selectedCat));
  }, [products, selectedCat]);

  return (
    <main id="top" className="overflow-x-clip relative text-gray-900">
      {/* 背景：柔らかグラデ */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_20%_20%,#fff0f6_0%,transparent_60%),radial-gradient(70%_100%_at_80%_20%,#e6f7ff_0%,transparent_60%),linear-gradient(180deg,#ffffff,#fffaf5)]" />
      <div className="bg-grid pointer-events-none" />

      {/* 飾りブロブ（モバイルは控えめ） */}
      <div className="hidden md:block pointer-events-none absolute -top-20 -left-10 size-72 rounded-full blur-3xl bg-pink-200/50 animate-pulse-slow" />
      <div className="hidden md:block pointer-events-none absolute -bottom-20 -right-10 size-80 rounded-full blur-3xl bg-sky-200/50 animate-pulse-slow" />

      {/* ヘッダー */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-wide text-lg text-gray-900">
            <span className="inline-flex items-center gap-2">
              <span className="size-6 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 shadow-inner" />
              HANA
            </span>
          </a>
          <nav className="flex items-center gap-3 text-sm">
            <a href="#catalog" className="navlink text-gray-900">ラインナップ</a>
            <a href="#order" className="navlink text-gray-900">申し込み</a>
            <a href="tel:0120-000-000" className="btn-ghost">📞 0120-000-000</a>
            <a href="#order" className="btn-primary hidden sm:inline-flex">今すぐ相談</a>
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="relative mx-auto max-w-6xl px-4 pt-8">
        <div className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
          <HeroSlider images={heroImages} intervalMs={3500} />
          {/* 白パネル＋濃い文字 */}
          <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-lg ring-1 ring-black/5">
              <h1 className="text-[22px] md:text-4xl font-semibold tracking-tight text-gray-900">
                想いを花にのせて
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">
                ブーケ・アレンジメント・スタンド花｜即日手配もご相談ください
              </p>
              <div className="mt-4 flex gap-3">
                <a href="#catalog" className="btn-primary">カタログを見る</a>
                <a href="#order" className="btn-secondary">見積り・ご相談</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カタログ */}
      <section id="catalog" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="section-title text-gray-900 pt-3">ラインナップ</h2>
        <p className="section-sub text-gray-700">
          季節のおすすめ・祝い・母の日など、用途に合わせてお選びください。
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip label="すべて" active={selectedCat === "all"} onClick={() => setSelectedCat("all")} />
          {sortedCategories.map((c) => (
            <FilterChip key={c.id} label={c.name} active={selectedCat === c.id} onClick={() => setSelectedCat(c.id)} />
          ))}
        </div>

        <PricingGrid
          products={filteredProducts}
          onPick={(pid) => setForm((v) => ({ ...v, catalogId: pid }))}
        />
      </section>

      {/* ▼▼ ここから Q&A セクションを追加 ▼▼ */}
      <section id="qa" className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="section-title text-gray-900">よくあるご質問</h2>
        <p className="section-sub text-gray-700">
          ご不明点はお気軽にお電話（<a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a>）でも承ります。
        </p>

        <div className="mt-6 grid gap-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-white/95 backdrop-blur ring-1 ring-black/5 shadow-sm open:shadow-md transition"
            >
              <summary className="list-none cursor-pointer select-none px-5 py-4 flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-sky-400 text-white text-xs font-semibold">
                  Q
                </span>
                <span className="font-medium text-gray-900">{f.q}</span>
                <span className="ml-auto text-gray-500 transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>
      {/* ▲▲ Q&A ここまで ▲▲ */}

      {/* 申込フォーム（EmailJS送信） */}
      <OrderForm
        form={form}
        setForm={setForm}
        done={done}
        setDone={setDone}
        sending={sending}
        setSending={setSending}
        error={error}
        setError={setError}
      />

      {/* フッター */}
      <footer className="py-12 text-center text-sm text-gray-600 bg-gradient-to-t from-pink-50 to-white">
        <p>© {new Date().getFullYear()} HANA Flower Shop</p>
      </footer>
    </main>
  );
}

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "最短どれくらいで届けられますか？当日対応は可能ですか？",
    a: (
      <p>
        在庫状況とお届け先により異なりますが、<strong>店頭在庫での当日手配</strong>もご相談可能です。
        お急ぎの際はまずお電話（<a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a>）
        でご希望の時間・エリアをお知らせください。
      </p>
    ),
  },
  {
    q: "支払い方法は？領収書やインボイスは発行できますか？",
    a: (
      <p>
        現金・各種クレジット・お振込に対応（法人様は請求書払いも可）。<strong>領収書・適格請求書（インボイス）発行</strong>に対応しています。
      </p>
    ),
  },
  {
    q: "配達エリアと配送料を教えてください。",
    a: (
      <p>
        当店近隣エリアは自社便で配達、遠方は提携便での配送となります。<strong>距離・サイズで配送料が変動</strong>しますので、
        まずはお見積りをご依頼ください（お電話でもOK）。
      </p>
    ),
  },
  {
    q: "色や雰囲気の指定はできますか？カタログ外も注文可能？",
    a: (
      <p>
        可能です。<strong>色味・用途・ご予算</strong>をフォームの「ご要望」にご記入ください。画像サンプルがあれば仕上がりがスムーズです。
      </p>
    ),
  },
  {
    q: "キャンセルや変更はできますか？",
    a: (
      <p>
        仕入れ・制作の進行状況により対応可否が変わります。<strong>できるだけ早めのご連絡</strong>をお願いします。
      </p>
    ),
  },
  {
    q: "電話だけで申込みできますか？",
    a: (
      <p>
        はい、可能です。<a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a> にて承ります。
        フォーム送信後も、内容確認は<strong>お電話でご連絡</strong>いたします。
      </p>
    ),
  },
];

function FilterChip({
  label,
  active,
  onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`chip ${active ? "chip-active" : ""} text-gray-900`}
    >
      {label}
    </button>
  );
}

function OrderForm({
  form,
  setForm,
  done,
  setDone,
  sending,
  setSending,
  error,
  setError,
}: any) {
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
      if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) throw new Error("EmailJSの環境変数が未設定です（NEXT_PUBLIC_EMAILJS_*）。");

      emailjs.init(PUBLIC_KEY);
      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: form.name,
        phone: form.phone,
        catalogId: form.catalogId,
        quantity: String(form.quantity),
        preferredTime: form.preferredTime,
        message: form.message,
      });
      if (res.status !== 200) throw new Error("EmailJS送信に失敗しました");
      setDone(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "送信に失敗しました");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <section id="order" className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">送信ありがとうございました。</h3>
            <p className="mb-2 text-gray-700">
              担当より <strong>お電話</strong> にてご連絡し、内容確認のうえ正式なお手続きとなります。
            </p>
            <p className="text-gray-700">
              お急ぎの方は <a className="underline text-gray-900" href="tel:0120-000-000">0120-000-000</a> までお電話ください。
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="section-title text-gray-900">お申し込み</h2>
        <p className="section-sub text-gray-700">
          必要事項をご記入のうえ送信してください。折り返しお電話いたします。
        </p>

        {/* 白カードに入れて視認性UP */}
        <div className="card mt-6">
          <form onSubmit={submit} className="grid gap-5" noValidate>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="field">
                <span className="text-gray-700">お名前 <em className="req">*</em></span>
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例）山田 花子"
                  spellCheck={false}
                  className="input-lg"
                />
              </label>
              <label className="field">
                <span className="text-gray-700">お電話番号 <em className="req">*</em></span>
                <input
                  id="phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="例）090-1234-5678"
                  className="input-lg"
                />
              </label>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <label className="field">
                <span className="text-gray-700">カタログ番号</span>
                <input
                  id="catalogId"
                  autoComplete="off"
                  value={form.catalogId}
                  onChange={(e) => setForm({ ...form, catalogId: e.target.value })}
                  placeholder="例）A201"
                  className="input-lg"
                />
              </label>
              <label className="field">
                <span className="text-gray-700">数量</span>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="input-lg"
                />
              </label>
              <label className="field">
                <span className="text-gray-700">ご希望の連絡時間（任意）</span>
                <input
                  id="preferredTime"
                  autoComplete="off"
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  placeholder="例）本日 18:00〜19:00"
                  className="input-lg"
                />
              </label>
            </div>

            <label className="field">
              <span className="text-gray-700">ご要望・用途（任意）</span>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-lg min-h-[140px]"
                placeholder="色味、用途（誕生日／開店祝いなど）、配達希望 など"
                spellCheck={false}
              />
            </label>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3">
              <button disabled={sending} className="btn-primary w-full sm:w-auto">
                {sending ? "送信中..." : "内容を送信する"}
              </button>
              <a href="tel:0120-000-000" className="btn-ghost w-full sm:w-auto">📞 まずは電話で相談</a>
            </div>

            <p className="text-xs text-gray-600 mt-2">
              <em className="req">*</em> は必須項目です。送信後はお電話で内容確認のうえご契約となります。お急ぎの方は{" "}
              <a className="underline text-gray-800" href="tel:0120-000-000">0120-000-000</a> へ。
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

