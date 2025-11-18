
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { role } = await request.json();
    // In a real app, you would update the user's role in the database.
    // For this mock API, we just return a success response.
    return NextResponse.json({ message: 'Role updated successfully' });
}
