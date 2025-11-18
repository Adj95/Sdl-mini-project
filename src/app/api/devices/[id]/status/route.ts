
import { NextResponse } from 'next/server';
import { Device } from '@/types';

// This is a shared mock database.
// In a real application, you would use a proper database.
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


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { status } = await request.json();
  const { id } = await params;
  
  // This is a hack to make the mock API work with the dashboard optimistic updates
  // In a real app, this state would be shared or come from a database.
  const deviceIndex = mockDevices.findIndex(d => d._id === id);

  if (deviceIndex !== -1) {
    const device = { ...mockDevices[deviceIndex], status: { ...mockDevices[deviceIndex].status, ...status } };
    return NextResponse.json(device);
  }

  // Fallback for devices not in the initial mock list, if any are added dynamically
   const globalDevices: Device[] | undefined = (global as any).mockDevices;
   if(globalDevices) {
    const globalDeviceIndex = globalDevices.findIndex(d => d._id === id);
    if (globalDeviceIndex !== -1) {
        globalDevices[globalDeviceIndex].status = { ...globalDevices[globalDeviceIndex].status, ...status };
        return NextResponse.json(globalDevices[globalDeviceIndex]);
    }
   }


  return new NextResponse('Device not found', { status: 404 });
}
