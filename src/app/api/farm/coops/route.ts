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

    const coop = await prisma.coop.create({
      data: {
        name,
        capacity,
        farmId: farm.id,
      },
    });

    return NextResponse.json(coop, { status: 201 });
  } catch (error) {
    console.error('Error creating coop:', error);
    return NextResponse.json({ error: 'Failed to create coop' }, { status: 500 });
  }
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
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    const coops = await prisma.coop.findMany({
      where: { farmId: farm.id },
    });

    return NextResponse.json(coops);
  } catch (error) {
    console.error('Error fetching coops:', error);
    return NextResponse.json({ error: 'Failed to fetch coops' }, { status: 500 });
  }
}
