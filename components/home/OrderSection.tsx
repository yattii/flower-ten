// components/home/OrderSection.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

export type SimpleProduct = { id: string; name: string };

type OrderFormState = {
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  catalogId: string;
  quantity: number;
  preferredTime: string;
  message: string;

  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
};

type Errors = Partial<Record<keyof OrderFormState, string>>;

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const isValidJPPhone = (v: string) => /^\d{10,11}$/.test(v);
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function OrderSection({
  products,
  initialCatalogId,
}: {
  products: SimpleProduct[];
  initialCatalogId?: string;
}) {
  const [form, setForm] = useState<OrderFormState>({
    applicantName: "",
    applicantAddress: "",
    applicantPhone: "",
    applicantEmail: "",
    catalogId: initialCatalogId ?? "",
    quantity: 1,
    preferredTime: "",
    message: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
  });

  useEffect(() => {
    if (initialCatalogId) {
      setForm((v) => ({ ...v, catalogId: initialCatalogId }));
    }
  }, [initialCatalogId]);

  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const options = useMemo(
    () => [...products].sort((a, b) => String(a.id).localeCompare(String(b.id), "ja")),
    [products]
  );

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.applicantName.trim()) e.applicantName = "お名前を入力してください。";
    if (!form.applicantPhone) e.applicantPhone = "お電話番号を入力してください。";
    else if (!isValidJPPhone(form.applicantPhone)) e.applicantPhone = "数字のみで10〜11桁で入力してください。";
    if (!form.applicantEmail) e.applicantEmail = "メールアドレスを入力してください。";
    else if (!isValidEmail(form.applicantEmail)) e.applicantEmail = "正しい形式のメールアドレスを入力してください。";

    if (!form.catalogId) e.catalogId = "カタログ番号を選択してください。";
    if (!form.quantity || form.quantity < 1) e.quantity = "数量は1以上で入力してください。";
    if (form.message.length > 1000) e.message = "備考は1000文字以内で入力してください。";

    if (!form.recipientName.trim()) e.recipientName = "お届け先名を入力してください。";
    if (!form.recipientAddress.trim()) e.recipientAddress = "お届け先住所を入力してください。";
    if (form.recipientPhone && !isValidJPPhone(form.recipientPhone)) e.recipientPhone = "数字のみで10〜11桁で入力してください。";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
  
    if (!validate()) {
      const first = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  
    setSending(true);
    try {
      const payload = {
        applicant_name: form.applicantName,
        applicant_address: form.applicantAddress,
        applicant_phone: form.applicantPhone,
        applicant_email: form.applicantEmail,
        catalog_id: form.catalogId,
        catalog_name: products.find(p => p.id === form.catalogId)?.name ?? "",
        quantity: String(form.quantity),
        preferred_time: form.preferredTime,
        message: form.message,
        recipient_name: form.recipientName,
        recipient_address: form.recipientAddress,
        recipient_phone: form.recipientPhone || "",
      };
  
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.detail || "送信に失敗しました");
      }
  
      // 成功：フォームリセット & ポップアップ
      setForm({
        applicantName: "",
        applicantAddress: "",
        applicantPhone: "",
        applicantEmail: "",
        catalogId: "",
        quantity: 1,
        preferredTime: "",
        message: "",
        recipientName: "",
        recipientAddress: "",
        recipientPhone: "",
      });
      setShowPopup(true);
    } catch (err: any) {
      setError(err?.message || "送信に失敗しました");
    } finally {
      setSending(false);
    }
  }
  

  return (
    <section id="order" className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="section-title text-gray-900 pt-11">お申し込み</h2>

        <div className="card mt-6 grid gap-8 w-full overflow-x-hidden">
  <form onSubmit={submit} className="grid gap-8 w-full" noValidate>
    {/* ===== お申込者情報 ===== */}
    <fieldset className="grid gap-4 w-full">
      <legend className="text-base font-semibold text-gray-900">お申込者情報</legend>
      <div className="grid gap-5 sm:grid-cols-2 w-full">
        <LabeledInput
          label="お名前*"
          name="applicantName"
          value={form.applicantName}
          onChange={(v) => setForm({ ...form, applicantName: v })}
          placeholder="山田 太郎"
          error={errors.applicantName}
          required
          className="w-full"
        />
        <LabeledInput
          label="お電話番号*"
          name="applicantPhone"
          value={form.applicantPhone}
          onChange={(v) => setForm({ ...form, applicantPhone: onlyDigits(v) })}
          placeholder="09012345678（ハイフンなし）"
          error={errors.applicantPhone}
          inputMode="numeric"
          maxLength={11}
          required
          className="w-full"
        />
        <LabeledInput
          className="sm:col-span-2 w-full"
          label="住所"
          name="applicantAddress"
          value={form.applicantAddress}
          onChange={(v) => setForm({ ...form, applicantAddress: v })}
          placeholder="〒123-4567 東京都〇〇区〇〇 1-2-3"
        />
        <LabeledInput
          className="sm:col-span-2 w-full"
          label="メールアドレス*"
          name="applicantEmail"
          value={form.applicantEmail}
          onChange={(v) => setForm({ ...form, applicantEmail: v })}
          placeholder="taro@example.com"
          error={errors.applicantEmail}
          type="email"
          inputMode="email"
          required
        />
      </div>
    </fieldset>

    {/* ===== ご希望（カタログ番号など） ===== */}
    <fieldset className="grid gap-4 w-full">
      <legend className="text-base font-semibold text-gray-900">ご希望</legend>
      <div className="grid gap-5 sm:grid-cols-3 w-full">
        <div className="field sm:col-span-2 w-full">
          <span className="text-gray-700">カタログ番号*</span>
          <select
            name="catalogId"
            required
            value={form.catalogId}
            onChange={(e) => setForm({ ...form, catalogId: e.target.value })}
            className={`input-lg w-full ${errors.catalogId ? "ring-2 ring-red-400" : ""}`}
            aria-invalid={!!errors.catalogId}
          >
            <option value="" disabled>選択してください</option>
            {options.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name}
              </option>
            ))}
          </select>
          {errors.catalogId && <p className="mt-1 text-xs text-red-600">{errors.catalogId}</p>}
        </div>

        <LabeledInput
          label="数量"
          name="quantity"
          type="number"
          value={String(form.quantity)}
          onChange={(v) => setForm({ ...form, quantity: Math.max(1, Number(v || 1)) })}
          error={errors.quantity}
          inputMode="numeric"
          min={1}
          className="w-full"
        />

        <LabeledInput
          className="sm:col-span-3 w-full"
          label="連絡希望時間（任意）"
          name="preferredTime"
          value={form.preferredTime}
          onChange={(v) => setForm({ ...form, preferredTime: v })}
          placeholder="例：平日 10:00-18:00 など"
        />

        <div className="field sm:col-span-3 w-full">
          <span className="text-gray-700">ご要望・備考</span>
          <textarea
            name="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`input-lg w-full min-h-[120px] ${errors.message ? "ring-2 ring-red-400" : ""}`}
            placeholder="色味・雰囲気、用途、ご予算の目安など"
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>
      </div>
    </fieldset>

    {/* ===== お届け先情報 ===== */}
    <fieldset className="grid gap-4 w-full">
      <legend className="text-base font-semibold text-gray-900">お届け先情報</legend>
      <div className="grid gap-5 sm:grid-cols-2 w-full">
        <LabeledInput
          label="お届け先名*"
          name="recipientName"
          value={form.recipientName}
          onChange={(v) => setForm({ ...form, recipientName: v })}
          error={errors.recipientName}
          required
          className="w-full"
        />
        <LabeledInput
          label="お届け先電話番号"
          name="recipientPhone"
          value={form.recipientPhone}
          onChange={(v) => setForm({ ...form, recipientPhone: onlyDigits(v) })}
          placeholder="（任意）09012345678"
          error={errors.recipientPhone}
          inputMode="numeric"
          maxLength={11}
          className="w-full"
        />
        <LabeledInput
          className="sm:col-span-2 w-full"
          label="お届け先住所*"
          name="recipientAddress"
          value={form.recipientAddress}
          onChange={(v) => setForm({ ...form, recipientAddress: v })}
          error={errors.recipientAddress}
          required
        />
      </div>
    </fieldset>

    {/* 送信 */}
    <div className="pt-2">
      <button disabled={sending} className="btn-primary w-full sm:w-auto">
        {sending ? "送信中..." : "内容を送信する"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  </form>
</div>

      </div>

      {/* 送信完了ポップアップ */}
{showPopup && (
  <div
    className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
  >
    <button
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowPopup(false)}
      aria-label="閉じる"
    />
    <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl ring-1 ring-black/10">
      <h3 className="text-lg font-semibold text-gray-900">送信が完了しました</h3>
      <p className="mt-2 text-gray-700">
        お申し込み内容を受け付けました。<br />
        確認の自動返信メールをお送りしましたのでご確認ください。
      </p>
      <p className="mt-4 text-sm text-gray-600">
        ※当店では <strong>電話での申し込み対応のみ</strong> を行っております。<br />
        担当者よりお電話にてご連絡いたします。
      </p>

      <div className="mt-5">
        <button onClick={() => setShowPopup(false)} className="btn-primary">
          閉じる
        </button>
      </div>
    </div>
  </div>
)}
{/* 電話でのお申し込み案内 */}
<div className="mt-10 text-center">
      <p className="text-gray-700 mb-3">
        当店では <strong>直接電話でのお申し込み対応</strong> も行っております。<br />
        お急ぎの方は次のお電話番号から直接お申し込みください。
      </p>
      <a
        href="tel:09012345678"   // ←ここを実際の番号に置き換えてください
        className="inline-block px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition"
      >
        📞 090-1234-5678 に電話する
      </a>
    </div>
    </section>
  );
}

/* ---------- 小さな入力コンポーネント ---------- */
function LabeledInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  inputMode,
  maxLength,
  min,
  error,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  min?: number;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className={`field ${className}`}>
      <span className="text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-lg ${error ? "ring-2 ring-red-400" : ""}`}
        placeholder={placeholder}
        aria-invalid={!!error}
        maxLength={maxLength}
        min={min}
        required={required}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
    
  );
  
}
