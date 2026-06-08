// jest.mock is hoisted above imports by Jest — mocks are active when route.ts loads
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status ?? 200,
    }),
  },
}))

const sendMock = jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}))

// The route requires these to be configured before it will attempt a send.
process.env.RESEND_API_KEY = 're_test_key'
process.env.MAIL_TO = 'owner@example.com'

import { POST } from '@/app/api/contact/route'

type MockRequest = { json: () => Promise<unknown> }

function makeRequest(body: unknown): MockRequest {
  return { json: async () => body }
}

describe('POST /api/contact', () => {
  beforeEach(() => sendMock.mockClear())

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ name: 'Alice' }) as never)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeTruthy()
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({ name: 'Alice', email: 'notanemail', subject: 'Hi', message: 'Hello' }) as never)
    expect(res.status).toBe(400)
  })

  it('returns 200 for a valid request and sends the email', async () => {
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'owner@example.com', replyTo: 'alice@example.com' }),
    )
  })

  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    const saved = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(500)
    expect(sendMock).not.toHaveBeenCalled()
    process.env.RESEND_API_KEY = saved
  })

  it('returns 500 when MAIL_TO is not configured', async () => {
    const saved = process.env.MAIL_TO
    delete process.env.MAIL_TO
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(500)
    expect(sendMock).not.toHaveBeenCalled()
    process.env.MAIL_TO = saved
  })

  it('returns 400 when the request body is not valid JSON', async () => {
    const res = await POST({ json: async () => { throw new Error('bad json') } } as never)
    expect(res.status).toBe(400)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns 400 when name or subject contains CR/LF (header injection)', async () => {
    const injected = await POST(makeRequest({
      name: 'Alice\r\nBcc: victim@example.com', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(injected.status).toBe(400)

    const injectedSubject = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hi\nX-Header: evil', message: 'Test message',
    }) as never)
    expect(injectedSubject.status).toBe(400)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the message exceeds the maximum length', async () => {
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'x'.repeat(5001),
    }) as never)
    expect(res.status).toBe(400)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('truncates an over-long name in the From header and keeps it CR/LF-free', async () => {
    const res = await POST(makeRequest({
      name: 'A'.repeat(500), email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(200)
    const [args] = sendMock.mock.calls
    const from = (args[0] as { from: string }).from
    expect(from).not.toMatch(/[\r\n]/)
    // 200-char cap from sanitizeHeader, plus the " <addr>" suffix.
    expect((args[0] as { from: string }).from.length).toBeLessThanOrEqual(200 + ' <onboarding@resend.dev>'.length)
  })

  it('returns 500 when Resend responds with an error object', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'rejected' } })
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.ok).toBeUndefined()
  })

  it('returns 500 when the Resend call throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('network down'))
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(500)
  })
})
