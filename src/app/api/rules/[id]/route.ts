
import { NextResponse } from 'next/server';

// Note: This is a simplified mock API. The data is not persisted.

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const updatedData = await request.json();
    // In a real app, you'd find and update the rule in the database.
    // For this mock, we'll just return the updated data as if it were successful.
    return NextResponse.json({ _id: id, ...updatedData });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    // In a real app, you'd delete the rule from the database.
    // For this mock, we'll just return a success response.
    return new NextResponse(null, { status: 204 });
}
