
import { NextResponse } from 'next/server';
import { EnergyData, Device } from '@/types';

// Using the same device data as the main devices endpoint for consistency
const mockDevices: Device[] = [
  { _id: '1', name: 'Living Room Light', type: 'light', room: 'Living Room', status: { isOn: true }, powerRating: 60 },
  { _id: '2', name: 'Bedroom Fan', type: 'fan', room: 'Bedroom', status: { isOn: false, speed: 50 }, powerRating: 75 },
  { _id: '3', name: 'Kitchen AC', type: 'ac', room: 'Kitchen', status: { isOn: true, temperature: 22 }, powerRating: 1500 },
  { _id: '4', name: 'Main Door', type: 'door', room: 'Living Room', status: { isOpen: false }, powerRating: 25 },
  { _id: '5', name: 'Office Light', type: 'light', room: 'Office', status: { isOn: false }, powerRating: 40 },
];

export async function GET() {
    // Simulate some energy usage for today
    const kwhPerDevice: { [key: string]: number } = {
        '1': 0.24, // 60W * 4 hours
        '2': 0,    // Fan is off
        '3': 4.5,  // 1500W * 3 hours
        '4': 0.05, // 25W * 2 hours
        '5': 0.12, // 40W * 3 hours
    };

    const totalEnergyUsedToday = Object.values(kwhPerDevice).reduce((sum, kwh) => sum + kwh, 0);
    const energyRate = 0.15; // Placeholder rate in $/kWh
    const estimatedBill = totalEnergyUsedToday * energyRate;

    const energyData: EnergyData = {
        totalEnergyUsedToday,
        estimatedBill,
        kwhPerDevice,
        devices: mockDevices,
    };

    const response = NextResponse.json(energyData);
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
}
