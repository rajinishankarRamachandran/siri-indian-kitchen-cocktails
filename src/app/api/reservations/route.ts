import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reservations, session } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { sendStatusUpdateEmail } from '@/lib/mailer';

async function validateAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const sessions = await db.select()
      .from(session)
      .where(eq(session.token, token))
      .limit(1);

    if (sessions.length === 0) {
      return null;
    }

    const userSession = sessions[0];
    
    // Check if session is expired
    if (userSession.expiresAt < new Date()) {
      return null;
    }

    return userSession;
  } catch (error) {
    console.error('Auth validation error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, guests, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { 
          error: 'Missing required fields. Required: name, email, phone, date, time, guests',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate fields are not empty strings
    if (name.trim() === '' || email.trim() === '' || phone.trim() === '' || 
        date.trim() === '' || time.trim() === '' || guests.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Required fields cannot be empty',
          code: 'EMPTY_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone.trim();
    const sanitizedDate = date.trim();
    const sanitizedTime = time.trim();
    const sanitizedGuests = guests.trim();
    const sanitizedMessage = message ? message.trim() : null;

    const now = new Date().toISOString();

    // Create reservation
    const newReservation = await db.insert(reservations)
      .values({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        date: sanitizedDate,
        time: sanitizedTime,
        guests: sanitizedGuests,
        message: sanitizedMessage,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newReservation[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const userSession = await validateAuth(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let query = db.select().from(reservations);

    // Apply status filter if provided
    if (statusFilter) {
      query = query.where(eq(reservations.status, statusFilter));
    }

    // Order by createdAt DESC (most recent first)
    const results = await query.orderBy(desc(reservations.createdAt));

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Validate authentication
    const userSession = await validateAuth(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, alternativeTimes } = body;

    // Validate status field
    if (!status) {
      return NextResponse.json(
        { 
          error: 'Status field is required',
          code: 'MISSING_STATUS'
        },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'accepted', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: 'Invalid status value. Must be one of: pending, accepted, cancelled',
          code: 'INVALID_STATUS'
        },
        { status: 400 }
      );
    }

    // Check if reservation exists
    const existing = await db.select()
      .from(reservations)
      .where(eq(reservations.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    const reservation = existing[0];

    // Update reservation
    const updated = await db.update(reservations)
      .set({
        status: status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(reservations.id, parseInt(id)))
      .returning();

    // Send email notification to customer if status is accepted or cancelled
    if (status === 'accepted' || status === 'cancelled') {
      try {
        await sendStatusUpdateEmail({
          name: reservation.name,
          email: reservation.email,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          status: status as 'accepted' | 'cancelled',
          alternativeTimes: status === 'cancelled' && alternativeTimes ? alternativeTimes : undefined,
        });
        console.log(`Status update email sent to ${reservation.email}`);
      } catch (emailError) {
        // Log but don't fail the request if email fails
        console.error('Failed to send status update email:', emailError);
      }
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}