import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ name: string }> }) {
  const params = await context.params;
  const name = params.name;
  
  try {
    const res = await fetch(`http://136.116.183.226:8080/player/${name}`, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from VM' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
