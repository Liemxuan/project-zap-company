/**
 * API Proxy - forwards requests to backend API to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${API_BASE_URL}/${path}${request.nextUrl.search}`;
  
  console.log(`[API Proxy] GET Request to: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Proxy] GET Error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${API_BASE_URL}/${path}`;
  
  console.log(`[API Proxy] POST Request to: ${url}`);
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Proxy] POST Error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${API_BASE_URL}/${path}`;
  
  console.log(`[API Proxy] PUT Request to: ${url}`);
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Proxy] PUT Error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${API_BASE_URL}/${path}${request.nextUrl.search}`;
  
  console.log(`[API Proxy] DELETE Request to: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Proxy] DELETE Error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}
