
import { NextResponse } from 'next/server';
import { User } from '@/types';
import { subDays } from 'date-fns';

const now = new Date();

const mockUsers: User[] = [
    {
        _id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        createdAt: subDays(now, 10).toISOString(),
        avatar: 'https://i.pravatar.cc/150?u=test@example.com'
    },
    {
        _id: 'user-2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'user',
        createdAt: subDays(now, 5).toISOString(),
        avatar: 'https://i.pravatar.cc/150?u=jane@example.com'
    }
];

export async function GET() {
    return NextResponse.json(mockUsers);
}
