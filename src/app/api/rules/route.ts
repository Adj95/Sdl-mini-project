import clientPromise from '@/lib/mongodb';
import { AutomationRule } from '@/lib/models/rule';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const rules = await db.collection<AutomationRule>('rules').find({}).toArray();
  const response = NextResponse.json(rules);
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  return response;
}

export async function POST(request: Request) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection<AutomationRule>('rules').insertOne(data);
  const inserted = await db.collection<AutomationRule>('rules').findOne({ _id: result.insertedId });
  return NextResponse.json(inserted, { status: 201 });
}
