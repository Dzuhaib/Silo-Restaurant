import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const ADMIN_EMAIL = 'shahm4254684@gmail.com';

export async function sendReservationEmail({
  to,
  name,
  confirmationCode,
  date,
  time,
  partySize,
  isCancellation = false
}: {
  to: string;
  name: string;
  confirmationCode: string;
  date: string;
  time: string;
  partySize: number;
  isCancellation?: boolean;
}) {
  const subject = isCancellation
    ? `Reservation Cancelled - ${confirmationCode}`
    : `Reservation Confirmed - ${confirmationCode}`;

  const title = isCancellation ? 'Reservation Cancelled' : 'Reservation Confirmed';
  const message = isCancellation
    ? 'Your reservation at The Silo has been cancelled as requested.'
    : 'Your table at The Silo has been reserved. We look forward to welcome you!';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h1 style="color: #D4AF37; text-align: center;">The Silo.</h1>
      <h2 style="text-align: center; color: #374151;">${title}</h2>
      <p>Hello ${name},</p>
      <p>${message}</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Confirmation Code:</strong> ${confirmationCode}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Guests:</strong> ${partySize}</p>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?code=${confirmationCode}" 
           style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
           Manage Reservation
        </a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        The Silo Restaurant, Clifton, Karachi.
      </p>
    </div>
  `;

  try {
    console.log(`[Resend] Attempting to send email to: ${to} (Subject: ${subject})`);

    // Send to Guest
    const guestResponse = await resend.emails.send({
      from: 'The Silo <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (guestResponse.error) {
      console.error('[Resend Error - Guest]:', guestResponse.error);
    } else {
      console.log('[Resend Success - Guest]: Email sent successfully');
    }

    // Notify Admin
    console.log(`[Resend] Notifying Admin: ${ADMIN_EMAIL}`);
    const adminResponse = await resend.emails.send({
      from: 'The Silo System <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `[ADMIN] ${subject} - ${name}`,
      html: `
        <h3>New Activity Notification</h3>
        <p><strong>Action:</strong> ${isCancellation ? 'CANCELLATION' : 'NEW RESERVATION'}</p>
        <p><strong>Guest:</strong> ${name} (${to})</p>
        <p><strong>Details:</strong> ${date} at ${time} (${partySize} guests)</p>
        <p><strong>Code:</strong> ${confirmationCode}</p>
      `,
    });

    if (adminResponse.error) {
      console.error('[Resend Error - Admin]:', adminResponse.error);
    } else {
      console.log('[Resend Success - Admin]: Admin notified successfully');
    }

    return {
      success: !guestResponse.error && !adminResponse.error,
      guestError: guestResponse.error,
      adminError: adminResponse.error
    };
  } catch (error) {
    console.error('[Resend Exception]:', error);
    return { success: false, error };
  }
}
