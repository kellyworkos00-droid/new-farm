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

    const { coopId, date, type, description, quantity } = await request.json();

    if (!coopId || !date || !type || !description) {
      return NextResponse.json(
        { error: 'Coop ID, date, type, and description are required' },
        { status: 400 }
      );
    }

    // Verify coop belongs to user's farm
    const farm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    const coop = await prisma.coop.findFirst({
      where: { id: coopId, farmId: farm.id },
    });

    if (!coop) {
      return NextResponse.json({ error: 'Coop not found' }, { status: 404 });
    }

    const record = await prisma.healthRecord.create({
      data: {
        farmId: farm.id,
        coopId,
        date: new Date(date),
        type,
        description,
        quantity: quantity || 1,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating health record:', error);
    return NextResponse.json({ error: 'Failed to create health record' }, { status: 500 });
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

    const records = await prisma.healthRecord.findMany({
      where: { farmId: farm.id },
      include: {
        coop: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}
