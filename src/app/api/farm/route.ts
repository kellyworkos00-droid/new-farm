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

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const farm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
      include: {
        coops: true,
      },
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    return NextResponse.json(farm);
  } catch (error) {
    console.error('Error fetching farm:', error);
    return NextResponse.json({ error: 'Failed to fetch farm' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, location } = await request.json();

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Check if user already has a farm
    const existingFarm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
    });

    if (existingFarm) {
      return NextResponse.json(
        { error: 'User already has a farm' },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        name,
        location,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(farm, { status: 201 });
  } catch (error) {
    console.error('Error creating farm:', error);
    return NextResponse.json({ error: 'Failed to create farm' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, location } = await request.json();

    const farm = await prisma.farm.updateMany({
      where: { userId: decoded.userId },
      data: {
        ...(name && { name }),
        ...(location && { location }),
      },
    });

    return NextResponse.json({ message: 'Farm updated' });
  } catch (error) {
    console.error('Error updating farm:', error);
    return NextResponse.json({ error: 'Failed to update farm' }, { status: 500 });
  }
}
