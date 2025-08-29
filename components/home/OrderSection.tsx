"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";

type OrderFormState = {
  name: string; phone: string; catalogId: string; quantity: number; preferredTime: string; message: string;
};

export function OrderSection() {
  const [form, setForm] = useState<OrderFormState>({ name: "", phone: "", catalogId: "", quantity: 1, preferredTime: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setSending(true);
    try {
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      emailjs.init(PUBLIC_KEY);
      const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: form.name, phone: form.phone, catalogId: form.catalogId,
        quantity: String(form.quantity), preferredTime: form.preferredTime, message: form.message,
      });
      if (res.status !== 200) throw new Error("EmailJS送信に失敗しました");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally { setSending(false); }
  }

  if (done) {
    return (
      <section id="order" className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900">送信ありがとうございました。</h3>
            <p className="text-gray-700">担当より <strong>お電話</strong> にてご連絡し、内容確認のうえ正式なお手続きとなります。</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="section-title text-gray-900">お申し込み</h2>
        <div className="card mt-6">
          <form onSubmit={submit} className="grid gap-5">
            <label className="field">
              <span className="text-gray-700">お名前*</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-lg" />
            </label>
            <label className="field">
              <span className="text-gray-700">お電話番号*</span>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-lg" />
            </label>
            <button disabled={sending} className="btn-primary">{sending ? "送信中..." : "内容を送信する"}</button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
