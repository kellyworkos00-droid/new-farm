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

    const { date, name, type, dosage, coopsAffected, notes, cost } = await request.json();

    if (!date || !name || !type) {
      return NextResponse.json(
        { error: 'Date, name, and type are required' },
        { status: 400 }
      );
    }

    // Verify user has a farm
    const farm = await prisma.farm.findUnique({
      where: { userId: decoded.userId },
    });

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
    }

    const record = await prisma.medication.create({
      data: {
        farmId: farm.id,
        date: new Date(date),
        name,
        type,
        ...(dosage && { dosage }),
        ...(coopsAffected && { coopsAffected }),
        ...(notes && { notes }),
        ...(cost && { cost }),
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Error creating medication record:', error);
    return NextResponse.json({ error: 'Failed to create medication record' }, { status: 500 });
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

    const records = await prisma.medication.findMany({
      where: { farmId: farm.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching medication records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}
