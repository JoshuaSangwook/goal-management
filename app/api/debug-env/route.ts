import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  const authSecret = process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'
  const authUrl = process.env.NEXTAUTH_URL

  // Extract just the host from DATABASE_URL (hide password)
  let dbHost = 'NOT SET'
  if (dbUrl) {
    try {
      const url = new URL(dbUrl.replace('postgresql://', 'http://'))
      dbHost = url.hostname + ':' + url.port
    } catch {
      dbHost = 'INVALID FORMAT'
    }
  }

  return NextResponse.json({
    database: {
      host: dbHost,
      status: dbUrl ? 'SET' : 'NOT SET'
    },
    nextauth: {
      secret: authSecret,
      url: authUrl || 'NOT SET'
    }
  })
}
