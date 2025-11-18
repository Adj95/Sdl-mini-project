
import { NextResponse } from 'next/server';
import { Device } from '@/types';

// This is a shared mock database. In a real application, you would use a proper database.
// To allow mutations, we'll store it in a global variable in development.
const globalWithMock = global as typeof global & { mockDevices: Device[] };

if (!globalWithMock.mockDevices) {
    globalWithMock.mockDevices = [
        { _id: '1', name: 'Living Room Light', type: 'light', room: 'Living Room', status: { isOn: true }, powerRating: 60 },
        { _id: '2', name: 'Bedroom Fan', type: 'fan', room: 'Bedroom', status: { isOn: false, speed: 50 }, powerRating: 75 },
        { _id: '3', name: 'Kitchen AC', type: 'ac', room: 'Kitchen', status: { isOn: true, temperature: 22 }, powerRating: 1500 },
        { _id: '4', name: 'Main Door', type: 'door', room: 'Living Room', status: { isOpen: false }, powerRating: 25 },
        { _id: '5', name: 'Office Light', type: 'light', room: 'Office', status: { isOn: false }, powerRating: 40 },
    ];
}


export async function GET() {
  return NextResponse.json(globalWithMock.mockDevices);
}

export async function POST(request: Request) {
    const newDeviceData = await request.json();
    const newDevice: Device = {
        _id: `dev-${Date.now()}`,
        status: {}, // Default status
        ...newDeviceData
    };
    globalWithMock.mockDevices.push(newDevice);
    return NextResponse.json(newDevice, { status: 201 });
}
