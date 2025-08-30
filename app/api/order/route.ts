// app/api/order/route.ts
import { NextResponse } from "next/server";

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

type OrderPayload = {
  applicant_name: string;
  applicant_address?: string;
  applicant_phone: string;
  applicant_email: string;
  catalog_id: string;
  catalog_name?: string;
  quantity: string;
  preferred_time?: string;
  message?: string;
  recipient_name: string;
  recipient_address: string;
  recipient_phone?: string;
};

// ──簡易バリデーション（サーバー側でも最低限チェック）
const onlyDigits = (v: string) => v.replace(/\D/g, "");
const isValidPhoneJP = (v: string) => /^\d{10,11}$/.test(v);
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function bad(message: string) {
  return NextResponse.json({ error: "bad_request", detail: message }, { status: 400 });
}

async function sendViaEmailJS(template_id: string, params: OrderPayload) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  // Private Key を推奨（Bearerで送れる）
  const PRIVATE = process.env.EMAILJS_PRIVATE_KEY;
  if (PRIVATE) headers.Authorization = `Bearer ${PRIVATE}`;

  const body: any = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id,
    template_params: params,
  };

  // Privateが無い場合は user_id（＝Public Key）を同梱
  if (!PRIVATE) body.user_id = process.env.EMAILJS_PUBLIC_KEY;

  const res = await fetch(EMAILJS_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    // next: { revalidate: 0 } などは不要
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`EmailJS ${template_id} failed: ${res.status} ${t}`);
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as OrderPayload;

    // ── 必須・形式チェック
    if (!payload.applicant_name?.trim()) return bad("applicant_name is required");
    if (!payload.applicant_email?.trim() || !isValidEmail(payload.applicant_email))
      return bad("applicant_email invalid");
    payload.applicant_phone = onlyDigits(payload.applicant_phone || "");
    if (!isValidPhoneJP(payload.applicant_phone)) return bad("applicant_phone invalid");
    if (!payload.catalog_id?.trim()) return bad("catalog_id is required");
    if (!payload.recipient_name?.trim()) return bad("recipient_name is required");
    if (!payload.recipient_address?.trim()) return bad("recipient_address is required");

    // ── ENV確認
    const SID = process.env.EMAILJS_SERVICE_ID;
    const TPL_ADMIN = process.env.EMAILJS_TEMPLATE_ID_ADMIN;
    const TPL_CONFIRM = process.env.EMAILJS_TEMPLATE_ID_CONFIRM;
    if (!SID || !TPL_ADMIN || !TPL_CONFIRM) throw new Error("EmailJS env is missing");

    // ── 2通同時送信（管理者宛 + 自動返信）
    await Promise.all([
      sendViaEmailJS(TPL_ADMIN, payload),
      sendViaEmailJS(TPL_CONFIRM, payload),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/order] error:", err?.message || err);
    return NextResponse.json(
      { error: "send_failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
