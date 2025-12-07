import { NextRequest, NextResponse } from 'next/server';
import { sendReservationEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, guests, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    const emailResult = await sendReservationEmail({
      name,
      email,
      phone,
      date,
      time,
      guests,
      message: message || '',
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send reservation email. Please try again or call us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation request sent successfully',
    });
  } catch (error) {
    console.error('Reservation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
