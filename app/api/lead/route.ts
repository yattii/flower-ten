// app/api/lead/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { name, phone, catalogId, quantity, preferredTime, message } = data || {};

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "必須項目が未入力です" },
      { status: 400 }
    );
  }

  const payload = `
■お名前: ${name}
■電話: ${phone}
■カタログ番号: ${catalogId ?? ""}
■数量: ${quantity ?? ""}
■希望連絡時間: ${preferredTime ?? ""}
■メモ:
${message ?? ""}
`;

  // --- メール通知例（Resendを利用する場合） ---
  try {
    if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL && process.env.TO_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL,
          to: process.env.TO_EMAIL,
          subject: `【新規申込み】${name} 様 / ${catalogId ?? "未指定"}`,
          text: payload,
        }),
      });
    }
  } catch (e) {
    console.error("メール送信エラー", e);
  }

  // --- Slack通知例 ---
  try {
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `新規申込み\n${payload}` }),
      });
    }
  } catch (e) {
    console.error("Slack通知エラー", e);
  }

  return NextResponse.json({ ok: true });
}
