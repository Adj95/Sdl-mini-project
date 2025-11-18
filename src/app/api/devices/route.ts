
import { NextResponse } from 'next/server';
import { Device } from '@/types';

const mockDevices: Device[] = [
  {
    _id: '1',
    name: 'Living Room Light',
    type: 'light',
    room: 'Living Room',
    status: { isOn: true },
    powerRating: 60,
  },
  {
    _id: '2',
    name: 'Bedroom Fan',
    type: 'fan',
    room: 'Bedroom',
    status: { isOn: false, speed: 50 },
    powerRating: 75,
  },
  {
    _id: '3',
    name: 'Kitchen AC',
    type: 'ac',
    room: 'Kitchen',
    status: { isOn: true, temperature: 22 },
    powerRating: 1500,
  },
  {
    _id: '4',
    name: 'Main Door',
    type: 'door',
    room: 'Living Room',
    status: { isOpen: false },
    powerRating: 25,
  },
  {
    _id: '5',
    name: 'Office Light',
    type: 'light',
    room: 'Office',
    status: { isOn: false },
    powerRating: 40,
  },
];

export async function GET() {
  const response = NextResponse.json(mockDevices);
  // Cache for 60 seconds to improve performance
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
  return response;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();
  const url = new URL(request.url);
  const id = url.pathname.split('/')[3];
  const deviceIndex = mockDevices.findIndex(d => d._id === id);

  if (deviceIndex > -1) {
    mockDevices[deviceIndex].status = { ...mockDevices[deviceIndex].status, ...status };
    return NextResponse.json(mockDevices[deviceIndex]);
  }

  return new NextResponse('Device not found', { status: 404 });
}
