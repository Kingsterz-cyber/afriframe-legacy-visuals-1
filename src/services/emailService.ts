import type { Booking } from './availabilityService';

// Email service configuration
// This is a simple implementation. For production, you should use a service like SendGrid, AWS SES, or similar

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

// Generate booking confirmation email for client
export const generateClientConfirmationEmail = (booking: Booking): EmailTemplate => {
  return {
    to: booking.clientEmail,
    subject: `Booking Confirmation - ${booking.service.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #D4AF37 0%, #C5A028 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #D4AF37; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! 🎉</h1>
            <p>Your cinematic experience is reserved</p>
          </div>
          <div class="content">
            <p>Dear ${booking.clientName},</p>
            <p>Thank you for booking with AfriFrame! We're excited to capture your special moments.</p>
            
            <div class="detail-box">
              <h2 style="margin-top: 0; color: #D4AF37;">Booking Details</h2>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span>${booking.service.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${booking.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${booking.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Starting Price:</span>
                <span>$${booking.service.startingPrice}</span>
              </div>
              ${booking.clientMessage ? `
                <div class="detail-row">
                  <span class="detail-label">Your Message:</span>
                  <span>${booking.clientMessage}</span>
                </div>
              ` : ''}
            </div>

            <p><strong>Status:</strong> ${booking.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending Confirmation'}</p>
            
            <p>We will contact you shortly to confirm the details and discuss your requirements.</p>
            
            <p style="margin-top: 30px;">
              <strong>Contact Information:</strong><br>
              Email: ${booking.clientEmail}<br>
              Phone: ${booking.clientPhone}
            </p>

            <div style="text-align: center;">
              <a href="mailto:booking@afriframe.com" class="button">Contact Us</a>
            </div>

            <div class="footer">
              <p><strong>AfriFrame Photography & Videography</strong></p>
              <p>Booking Reference: ${booking.id}</p>
              <p>If you have any questions, please don't hesitate to reach out.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Generate booking notification email for admin
export const generateAdminNotificationEmail = (booking: Booking, adminEmail: string): EmailTemplate => {
  return {
    to: adminEmail,
    subject: `New Booking Request - ${booking.service.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #D4AF37; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .urgent { background: #fff3cd; border-left-color: #ffc107; padding: 15px; margin: 20px 0; border-radius: 6px; }
          .button { display: inline-block; padding: 12px 30px; background: #D4AF37; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Booking Request</h1>
            <p>Action Required</p>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚡ New booking received!</strong> Please review and confirm.
            </div>
            
            <div class="detail-box">
              <h2 style="margin-top: 0; color: #D4AF37;">Booking Information</h2>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span>${booking.service.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span>${booking.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span>${booking.time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span style="color: #ffc107; font-weight: bold;">${booking.status.toUpperCase()}</span>
              </div>
            </div>

            <div class="detail-box">
              <h2 style="margin-top: 0; color: #D4AF37;">Client Details</h2>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span>${booking.clientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span><a href="mailto:${booking.clientEmail}">${booking.clientEmail}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span><a href="tel:${booking.clientPhone}">${booking.clientPhone}</a></span>
              </div>
              ${booking.clientMessage ? `
                <div class="detail-row">
                  <span class="detail-label">Message:</span>
                  <span style="font-style: italic;">"${booking.clientMessage}"</span>
                </div>
              ` : ''}
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p><strong>Quick Actions:</strong></p>
              <a href="mailto:${booking.clientEmail}" class="button">Email Client</a>
              <a href="tel:${booking.clientPhone}" class="button">Call Client</a>
            </div>

            <p style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
              Booking Reference: ${booking.id}<br>
              Please log in to your admin panel to confirm or manage this booking.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

// Send email using EmailJS (client-side) or your backend service
export const sendEmail = async (emailData: EmailTemplate): Promise<void> => {
  // This is a placeholder implementation
  // In production, you would:
  // 1. Use a service like EmailJS for client-side sending
  // 2. Or make an API call to your backend which uses SendGrid, AWS SES, etc.
  
  console.log('Sending email:', emailData);
  
  // Example using EmailJS (requires configuration):
  // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  //   to_email: emailData.to,
  //   subject: emailData.subject,
  //   html_content: emailData.html
  // });
  
  // For now, we'll just log it
  toast.info('Email notification would be sent to: ' + emailData.to);
};

// Helper to send all booking notifications
export const sendBookingNotifications = async (booking: Booking, adminEmail: string = 'admin@afriframe.com'): Promise<void> => {
  try {
    // Send confirmation to client
    const clientEmail = generateClientConfirmationEmail(booking);
    await sendEmail(clientEmail);
    
    // Send notification to admin
    const adminNotification = generateAdminNotificationEmail(booking, adminEmail);
    await sendEmail(adminNotification);
    
    console.log('Booking notifications sent successfully');
  } catch (error) {
    console.error('Error sending booking notifications:', error);
    throw error;
  }
};

import { toast } from 'sonner';
