import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reservations, session } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token against session table
    const validSession = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (validSession.length === 0) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Check if session is expired
    const sessionRecord = validSession[0];
    if (new Date(sessionRecord.expiresAt) < new Date()) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'UNAUTHORIZED' 
      }, { status: 401 });
    }

    // Get count of pending reservations
    const result = await db.select({ count: count() })
      .from(reservations)
      .where(eq(reservations.status, 'pending'));

    const pendingCount = result[0]?.count ?? 0;

    return NextResponse.json({ count: pendingCount }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}