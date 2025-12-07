import nodemailer from 'nodemailer';

interface ReservationEmailData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

interface StatusUpdateEmailData {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  status: 'accepted' | 'cancelled';
  alternativeTimes?: string[]; // Optional: suggest alternative times when cancelled due to booking
}

export async function sendReservationEmail(data: ReservationEmailData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #5E3023 0%, #895737 50%, #C08552 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #FAF6F0; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #C08552; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E8DCC8; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #5E3023; }
            .value { color: #895737; }
            .footer { text-align: center; margin-top: 20px; color: #895737; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-family: 'Cormorant Garamond', serif;">🍽️ New Reservation Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">SIRI Indian Kitchen & Cocktails</p>
            </div>
            <div class="content">
              <h2 style="color: #5E3023; margin-top: 0;">Reservation Details</h2>
              
              <div class="detail-box">
                <div class="detail-row">
                  <span class="label">Guest Name:</span>
                  <span class="value">${data.name}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${data.email}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">${data.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">${data.time}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Number of Guests:</span>
                  <span class="value">${data.guests}</span>
                </div>
              </div>

              ${data.message ? `
                <div class="detail-box">
                  <div class="label" style="margin-bottom: 10px;">Special Requests:</div>
                  <p style="margin: 0; color: #895737;">${data.message}</p>
                </div>
              ` : ''}

              <div class="footer">
                <p>Please contact the guest to confirm their reservation.</p>
                <p style="margin-top: 20px; font-size: 12px; color: #C08552;">
                  This email was sent from SIRI Indian Kitchen & Cocktails reservation system
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"SIRI Restaurant Reservations" <${process.env.EMAIL_USER}>`,
      to: 'sirirestaurant@aol.com',
      subject: `New Reservation: ${data.name} - ${data.date} at ${data.time}`,
      html: emailHTML,
      replyTo: data.email,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendStatusUpdateEmail(data: StatusUpdateEmailData) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const isAccepted = data.status === 'accepted';
    const statusColor = isAccepted ? '#22C55E' : '#EF4444';
    const statusText = isAccepted ? 'CONFIRMED' : 'CANCELLED';
    const statusEmoji = isAccepted ? '✅' : '❌';
    const hasAlternatives = data.alternativeTimes && data.alternativeTimes.length > 0;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.8; color: #2C2C2C; }
            .container { max-width: 650px; margin: 0 auto; padding: 20px; background: #FFFFFF; }
            .header { background: linear-gradient(135deg, #5E3023 0%, #895737 50%, #C08552 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo-text { font-size: 32px; font-family: 'Cormorant Garamond', serif; letter-spacing: 2px; margin: 0; font-weight: 700; }
            .content { background: #FAF6F0; padding: 40px 35px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 18px; color: #5E3023; margin-bottom: 20px; font-family: 'Georgia', serif; }
            .status-badge { background: ${statusColor}; color: white; padding: 14px 28px; border-radius: 30px; display: inline-block; font-weight: bold; margin: 25px 0; font-size: 16px; letter-spacing: 1px; }
            .detail-box { background: white; padding: 25px; margin: 25px 0; border-radius: 10px; border-left: 5px solid #C08552; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #E8DCC8; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #5E3023; font-size: 15px; }
            .value { color: #895737; font-size: 15px; }
            .alternative-times { background: #FFF9F0; border: 2px solid #C08552; padding: 25px; border-radius: 10px; margin: 25px 0; }
            .alternative-times h3 { color: #5E3023; margin-top: 0; font-size: 20px; font-family: 'Cormorant Garamond', serif; }
            .time-option { background: white; padding: 12px 20px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #C08552; font-size: 16px; color: #5E3023; font-weight: 500; }
            .contact-info { background: #E8DCC8; padding: 25px; border-radius: 10px; margin-top: 25px; }
            .contact-info h3 { color: #5E3023; margin-top: 0; font-size: 20px; font-family: 'Cormorant Garamond', serif; }
            .footer { text-align: center; margin-top: 30px; padding-top: 25px; border-top: 2px solid #E8DCC8; color: #895737; font-size: 14px; }
            .formal-closing { margin-top: 30px; font-style: italic; color: #5E3023; font-size: 16px; }
            .signature { margin-top: 20px; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #5E3023; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo-text">${statusEmoji} SIRI</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.95; font-size: 16px; letter-spacing: 1px;">Indian Kitchen & Cocktails</p>
            </div>
            <div class="content">
              <p class="greeting">Dear ${data.name},</p>
              
              ${isAccepted ? `
                <p style="font-size: 16px; color: #5E3023; line-height: 1.8;">
                  It is our distinct pleasure to confirm your reservation at SIRI Indian Kitchen & Cocktails. We are delighted to welcome you and your guests for an exceptional dining experience.
                </p>
              ` : `
                <p style="font-size: 16px; color: #5E3023; line-height: 1.8;">
                  We sincerely regret to inform you that ${hasAlternatives ? 'your requested time slot is currently unavailable' : 'we must cancel your reservation'}. Please accept our sincere apologies for any inconvenience this may cause.
                </p>
              `}

              <div class="status-badge">${statusText}</div>
              
              <div class="detail-box">
                <h3 style="color: #5E3023; margin-top: 0; font-family: 'Cormorant Garamond', serif; font-size: 22px;">Reservation Details</h3>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Requested Time:</span>
                  <span class="value">${data.time}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Party Size:</span>
                  <span class="value">${data.guests} ${parseInt(data.guests) === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              ${hasAlternatives ? `
                <div class="alternative-times">
                  <h3>✨ Available Alternative Times</h3>
                  <p style="color: #5E3023; margin-bottom: 15px; font-size: 15px;">
                    We would be honored to accommodate your party at one of the following available times on the same date:
                  </p>
                  ${data.alternativeTimes!.map(time => `
                    <div class="time-option">🕐 ${time}</div>
                  `).join('')}
                  <p style="color: #895737; margin-top: 20px; font-size: 14px; font-style: italic;">
                    To confirm one of these alternative times, please contact us at your earliest convenience via phone or email.
                  </p>
                </div>
              ` : ''}

              ${isAccepted ? `
                <div class="contact-info">
                  <h3>📍 Location & Contact Information</h3>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Address:</strong> 275 Rte 4 West, Paramus, NJ 07652</p>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Telephone:</strong> (555) 123-4567</p>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> info@sirirestaurant.com</p>
                  <p style="margin-top: 20px; font-size: 14px; color: #895737; line-height: 1.7;">
                    We kindly request that you arrive approximately 10 minutes prior to your reservation time. Should you need to modify or cancel your reservation, we would appreciate advance notice of at least 24 hours.
                  </p>
                </div>
              ` : `
                <div class="contact-info">
                  <h3>📞 We're Here to Assist You</h3>
                  <p style="margin: 8px 0; font-size: 15px;">We would be delighted to accommodate you at another time that suits your schedule.</p>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Telephone:</strong> (555) 123-4567</p>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> info@sirirestaurant.com</p>
                  <p style="margin: 8px 0; font-size: 15px;"><strong>Address:</strong> 275 Rte 4 West, Paramus, NJ 07652</p>
                  <p style="margin-top: 20px; font-size: 14px; color: #895737; line-height: 1.7;">
                    ${hasAlternatives ? 
                      'Please do not hesitate to contact us to confirm one of the suggested alternative times or to discuss other arrangements.' : 
                      'Please feel free to contact us to arrange a new reservation at your convenience. We sincerely look forward to serving you.'}
                  </p>
                </div>
              `}

              <p class="formal-closing">
                ${isAccepted ? 
                  'We eagerly anticipate your visit and the opportunity to provide you with an unforgettable culinary experience.' : 
                  'We deeply appreciate your understanding and sincerely hope to have the pleasure of welcoming you soon.'}
              </p>

              <div class="signature">
                <p style="margin: 5px 0;">Warm regards,</p>
                <p style="margin: 5px 0;">The SIRI Team</p>
                <p style="margin: 5px 0; font-size: 14px; color: #895737;">SIRI Indian Kitchen & Cocktails</p>
              </div>

              <div class="footer">
                <p style="margin: 10px 0; font-size: 13px; color: #C08552;">
                  Thank you for choosing SIRI Indian Kitchen & Cocktails
                </p>
                <p style="margin: 10px 0; font-size: 12px; color: #895737;">
                  This is an automated confirmation. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"SIRI Indian Kitchen & Cocktails" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Reservation ${statusText}: ${new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${data.time} - SIRI Restaurant`,
      html: emailHTML,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Status update email send failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}