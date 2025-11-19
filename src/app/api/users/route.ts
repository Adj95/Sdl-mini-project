import clientPromise from '@/lib/mongodb';
import { User } from '@/lib/models/user';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection<User>('users').find({}).toArray();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection<User>('users').insertOne(data);
  return NextResponse.json(result.ops[0]);
}
