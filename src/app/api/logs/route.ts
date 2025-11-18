
import { NextResponse } from 'next/server';
import { ActivityLog } from '@/types';
import { subHours, subMinutes } from 'date-fns';

const now = new Date();

const mockLogs: ActivityLog[] = [
    {
        _id: 'log-1',
        device: { _id: '1', name: 'Living Room Light' },
        action: 'Turned ON',
        triggeredBy: { type: 'user', id: 'mock-user-id', name: 'Test User' },
        timestamp: subMinutes(now, 5).toISOString()
    },
    {
        _id: 'log-2',
        device: { _id: '3', name: 'Kitchen AC' },
        action: 'Set temperature to 22°C',
        triggeredBy: { type: 'user', id: 'mock-user-id', name: 'Test User' },
        timestamp: subMinutes(now, 15).toISOString()
    },
    {
        _id: 'log-3',
        device: { _id: '4', name: 'Main Door' },
        action: 'Closed',
        triggeredBy: { type: 'automation', id: 'rule-auto-close', name: 'Auto-Lock' },
        timestamp: subHours(now, 1).toISOString()
    },
    {
        _id: 'log-4',
        device: { _id: '5', name: 'Office Light' },
        action: 'Turned OFF',
        triggeredBy: { type: 'user', id: 'mock-user-id', name: 'Test User' },
        timestamp: subHours(now, 2).toISOString()
    }
];

export async function GET() {
    // Sort logs by most recent first
    const sortedLogs = mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return NextResponse.json(sortedLogs);
}
