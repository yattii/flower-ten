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

function assertEnv() {
  const need = [
    "EMAILJS_SERVICE_ID",
    "EMAILJS_TEMPLATE_ID_ADMIN",
    "EMAILJS_TEMPLATE_ID_CONFIRM",
    "EMAILJS_PUBLIC_KEY",   // ← user_id に使う（Public）
    "EMAILJS_PRIVATE_KEY", // ← accessToken に使う（Private）
  ];
  const miss = need.filter(k => !process.env[k]?.trim());
  if (miss.length) throw new Error("EmailJS env is missing: " + miss.join(", "));
}

async function sendEmail(template_id: string, params: OrderPayload) {
  const body = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id,
    user_id: process.env.EMAILJS_PUBLIC_KEY,     // ← 必須（Public Key）
    accessToken: process.env.EMAILJS_PRIVATE_KEY, // ← 必須（Private Key）
    template_params: params,
  };

  const res = await fetch(EMAILJS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // keepalive: true, // ← 送信前にタブ閉じられるケースをケアしたいときだけ
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`EmailJS ${template_id} failed: ${res.status} ${txt}`);
  }
}

export async function POST(req: Request) {
  try {
    assertEnv();
    const payload = (await req.json()) as OrderPayload;

    await Promise.all([
      sendEmail(process.env.EMAILJS_TEMPLATE_ID_ADMIN!, payload),
      sendEmail(process.env.EMAILJS_TEMPLATE_ID_CONFIRM!, payload),
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
