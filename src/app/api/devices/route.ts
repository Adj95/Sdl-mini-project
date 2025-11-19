import clientPromise from '@/lib/mongodb';
import { Device } from '@/lib/models/device';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const devices = await db.collection<Device>('devices').find({}).toArray();
  const response = NextResponse.json(devices);
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  return response;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();
  const url = new URL(request.url);
  const id = url.pathname.split('/')[3];
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection<Device>('devices').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status } },
    { returnDocument: 'after' }
  ) as { value?: Device | null };

  if (result?.value) {
    return NextResponse.json(result.value);
  }
  return new NextResponse('Device not found', { status: 404 });
}
