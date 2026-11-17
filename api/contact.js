// Vercel serverless function: receives the contact form and emails it to Lemuel.
//
// How the email gets sent (first one that's configured wins):
//   1. Resend, if RESEND_API_KEY is set in Vercel (most reliable).
//   2. FormSubmit.co otherwise (no setup, but the very first message
//      triggers a one-time activation email that must be clicked).
//
// Optional Vercel environment variables:
//   CONTACT_TO      where messages go (default 03.ayesu@gmail.com)
//   RESEND_API_KEY  key from resend.com
//   RESEND_FROM     sender, e.g. "Website <hello@lemuelayesu.site>"
//                   (default onboarding@resend.dev, which only delivers to
//                   the email you signed up to Resend with)

const TO = process.env.CONTACT_TO || "03.ayesu@gmail.com";
const SITE = "https://lemuelayesu.site/";

function clean(v, max) { return String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, max); }
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (e) { return Object.fromEntries(new URLSearchParams(req.body)); }
  }
  return {};
}

async function viaResend(m) {
  const html =
    "<h2>New message from lemuelayesu.site</h2>" +
    "<p><strong>Name:</strong> " + esc(m.name) + "</p>" +
    "<p><strong>Email:</strong> " + esc(m.email) + "</p>" +
    "<p><strong>Phone:</strong> " + esc(m.phone || "Not given") + "</p>" +
    "<p><strong>Message:</strong></p><p>" + esc(m.message).replace(/\n/g, "<br>") + "</p>";
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Website contact <onboarding@resend.dev>",
      to: [TO],
      reply_to: m.email,
      subject: "New website message from " + m.name,
      html: html,
    }),
  });
  if (!r.ok) throw new Error("resend " + r.status + " " + (await r.text()).slice(0, 200));
}

async function viaFormSubmit(m) {
  const r = await fetch("https://formsubmit.co/ajax/" + TO, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": SITE.slice(0, -1), "Referer": SITE },
    body: JSON.stringify({
      name: m.name, email: m.email, phone: m.phone || "Not given", message: m.message,
      _subject: "New website message from " + m.name, _replyto: m.email, _template: "table", _captcha: "false",
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || String(j.success) === "false") throw new Error("formsubmit " + r.status + " " + JSON.stringify(j).slice(0, 200));
}

module.exports = async function handler(req, res) {
  const wantsJson = String(req.headers["accept"] || "").includes("application/json");
  const reply = (code, payload) => {
    if (wantsJson) return res.status(code).json(payload);
    res.statusCode = 303; res.setHeader("Location", "/?sent=" + (payload.ok ? "1" : "0") + "#contact"); return res.end();
  };

  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, error: "Method not allowed" }); }

  const b = await readBody(req);
  // Honeypot: real people never fill this in. Pretend it worked.
  if (clean(b.website, 200)) return reply(200, { ok: true });

  const m = {
    name: clean(b.name, 120),
    email: clean(b.email, 200),
    phone: clean(b.phone, 40),
    message: clean(b.message, 5000),
  };
  if (!m.name || !m.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
    return reply(400, { ok: false, error: "Please fill in your name, a valid email and a message." });
  }

  try {
    if (process.env.RESEND_API_KEY) await viaResend(m); else await viaFormSubmit(m);
    return reply(200, { ok: true });
  } catch (err) {
    console.error("contact send failed:", err && err.message);
    return reply(502, { ok: false, error: "Could not send right now." });
  }
};
