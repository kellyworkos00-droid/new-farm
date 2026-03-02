import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, capacity } = await request.json();

    if (!name || !capacity) {
      return NextResponse.json(
        { error: 'Name and capacity are required' },
        { status: 400 }
      );
    }

    // Get user's farm
    const farm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    // Verify the coop belongs to this farm
    const coop = await prisma.coop.findUnique({
      where: { id },
    });

    if (!coop || coop.farmId !== farm.id) {
      return NextResponse.json({ error: 'Coop not found' }, { status: 404 });
    }

    const updatedCoop = await prisma.coop.update({
      where: { id },
      data: {
        name,
        capacity,
      },
    });

    return NextResponse.json(updatedCoop);
  } catch (error) {
    console.error('Error updating coop:', error);
    return NextResponse.json({ error: 'Failed to update coop' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's farm
    const farm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    // Verify the coop belongs to this farm
    const coop = await prisma.coop.findUnique({
      where: { id },
    });

    if (!coop || coop.farmId !== farm.id) {
      return NextResponse.json({ error: 'Coop not found' }, { status: 404 });
    }

    await prisma.coop.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coop:', error);
    return NextResponse.json({ error: 'Failed to delete coop' }, { status: 500 });
  }
}
