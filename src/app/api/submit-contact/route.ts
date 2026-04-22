import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return NextResponse.json(
      { status: 'error', message: 'GOOGLE_SCRIPT_URL env var is not set (server-only, do NOT prefix with NEXT_PUBLIC_)' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(text, {
      status: upstream.ok ? 200 : upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Upstream request failed' },
      { status: 502 },
    );
  }
}
