import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactBody {
  name: string
  email: string
  subject: string
  message: string
}

/** Strip control characters that enable email header injection, trim, and cap length. */
function sanitizeHeader(s: string, maxLen = 200): string {
  return s.replace(/[\r\n\t"<>]/g, '').trim().slice(0, maxLen)
}

/** HTML-escape a string before placing it in an HTML email body. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Branded, email-client-safe (table + inline styles) message template. */
function renderEmail(name: string, email: string, subject: string, message: string) {
  const nameH = esc(name)
  const emailH = esc(email)
  const subjectH = esc(subject)
  const messageH = esc(message).replace(/\n/g, '<br>')
  const replyHref = `mailto:${emailH}?subject=${encodeURIComponent('Re: ' + subject)}`

  // Palette mirrors the site's light theme (periwinkle accent).
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin:0;padding:0;background:#eef1f8;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New message from ${nameH} via your CV site</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f8;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dce3f3;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="background:#405173;padding:22px 30px;">
          <div style="color:#ffffff;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;">Misha&#39;s Dev Spot</div>
          <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:5px;">New message from your site</div>
        </td></tr>
        <tr><td style="padding:26px 30px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1b2236;">
            <tr>
              <td style="padding:9px 0;color:#4a5573;width:84px;vertical-align:top;">From</td>
              <td style="padding:9px 0;font-weight:600;">${nameH}</td>
            </tr>
            <tr>
              <td style="padding:9px 0;color:#4a5573;vertical-align:top;border-top:1px solid #eef1f8;">Email</td>
              <td style="padding:9px 0;border-top:1px solid #eef1f8;"><a href="mailto:${emailH}" style="color:#405173;font-weight:600;text-decoration:none;">${emailH}</a></td>
            </tr>
            <tr>
              <td style="padding:9px 0;color:#4a5573;vertical-align:top;border-top:1px solid #eef1f8;">Subject</td>
              <td style="padding:9px 0;font-weight:600;border-top:1px solid #eef1f8;">${subjectH}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:10px 30px 4px;">
          <div style="color:#4a5573;font-size:11px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:9px;">Message</div>
          <div style="background:#f6f8fd;border:1px solid #dce3f3;border-radius:12px;padding:16px 18px;color:#1b2236;font-size:15px;line-height:1.6;">${messageH}</div>
        </td></tr>
        <tr><td style="padding:22px 30px 30px;">
          <a href="${replyHref}" style="display:inline-block;background:#405173;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:13px 26px;border-radius:999px;">Reply to ${nameH} &#8599;</a>
        </td></tr>
        <tr><td style="padding:16px 30px;background:#f6f8fd;border-top:1px solid #dce3f3;color:#8a93ad;font-size:12px;line-height:1.5;">
          Sent automatically from the contact form on your CV site. Just hit reply to respond.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text =
    `New message from your CV site\n\n` +
    `From:    ${name}\n` +
    `Email:   ${email}\n` +
    `Subject: ${subject}\n\n` +
    `Message:\n${message}\n\n` +
    `— Reply directly to this email to respond to ${name}.`

  return { html, text }
}

function isValidBody(b: unknown): b is ContactBody {
  if (!b || typeof b !== 'object') return false
  const { name, email, subject, message } = b as Record<string, unknown>
  return (
    typeof name    === 'string' && name.trim().length > 0 && !/[\r\n]/.test(name) &&
    typeof email   === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof subject === 'string' && subject.trim().length > 0 && !/[\r\n]/.test(subject) &&
    typeof message === 'string' && message.trim().length > 0
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: 'All fields (name, email, subject, message) are required.' },
      { status: 400 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.MAIL_TO
  if (!apiKey || !to) {
    console.error('Contact form not configured: set RESEND_API_KEY and MAIL_TO.')
    return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 })
  }

  const { name, email, subject, message } = body
  const safeName    = sanitizeHeader(name)
  const safeSubject = sanitizeHeader(subject)
  // Resend only allows sending from a verified domain or its test address.
  const fromAddress = process.env.MAIL_FROM ?? 'onboarding@resend.dev'

  const resend = new Resend(apiKey)
  const { html, text } = renderEmail(name, email, subject, message)

  try {
    const { data, error } = await resend.emails.send({
      from:    `${safeName || 'CV Contact'} <${fromAddress}>`,
      to,
      replyTo: email,
      subject: `[CV Contact] ${safeSubject}`,
      text,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    console.error('Mail error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
