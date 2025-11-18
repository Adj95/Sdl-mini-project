
import { NextResponse } from 'next/server';
import { Device } from '@/types';

const globalWithMock = global as typeof global & { mockDevices: Device[] };

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const updatedData = await request.json();
    const deviceIndex = globalWithMock.mockDevices.findIndex(d => d._id === id);

    if (deviceIndex > -1) {
        globalWithMock.mockDevices[deviceIndex] = { ...globalWithMock.mockDevices[deviceIndex], ...updatedData };
        return NextResponse.json(globalWithMock.mockDevices[deviceIndex]);
    }

    return new NextResponse('Device not found', { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const initialLength = globalWithMock.mockDevices.length;
    globalWithMock.mockDevices = globalWithMock.mockDevices.filter(d => d._id !== id);

    if (globalWithMock.mockDevices.length < initialLength) {
        return new NextResponse(null, { status: 204 });
    }

    return new NextResponse('Device not found', { status: 404 });
}
