import { NextRequest, NextResponse } from 'next/server'

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!
const MAILCHIMP_DC = process.env.MAILCHIMP_DC || 'us20'
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID!

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    const firstName = name?.split(' ')[0] || ''
    const lastName = name?.split(' ').slice(1).join(' ') || ''

    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: { FNAME: firstName, LNAME: lastName },
          tags: ['ebook-home-office'],
        }),
      }
    )

    const data = await response.json()

    // Already subscribed is OK
    if (!response.ok && data.title !== 'Member Exists') {
      throw new Error(data.detail || 'Error al suscribirse')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
