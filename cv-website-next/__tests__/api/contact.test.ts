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

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}))

import { POST } from '@/app/api/contact/route'

type MockRequest = { json: () => Promise<unknown> }

function makeRequest(body: unknown): MockRequest {
  return { json: async () => body }
}

describe('POST /api/contact', () => {
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

  it('returns 200 for a valid request', async () => {
    const res = await POST(makeRequest({
      name: 'Alice', email: 'alice@example.com',
      subject: 'Hello', message: 'Test message',
    }) as never)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })
})
