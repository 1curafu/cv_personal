import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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

  const { name, email, subject, message } = body
  const safeName    = sanitizeHeader(name)
  const safeSubject = sanitizeHeader(subject)

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from:    { name: safeName, address: process.env.SMTP_USER! },
      to:      process.env.MAIL_TO,
      replyTo: email,
      subject: `[CV Contact] ${safeSubject}`,
      text:    `From: ${name} <${email}>\n\n${message}`,
      html:    `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
