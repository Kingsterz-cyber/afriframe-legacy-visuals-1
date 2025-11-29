import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar as CalendarIcon, Phone, Mail } from 'lucide-react';
import type { BookingData } from './BookingFlow';
import { sendBookingNotifications, generateClientConfirmationEmail } from '@/services/emailService';
import { toast } from 'sonner';

interface BookingConfirmationCardProps {
  bookingData: BookingData;
  onBookAnother: () => void;
  onPayDeposit?: () => void;
}

const BookingConfirmationCard = ({
  bookingData,
  onBookAnother,
  onPayDeposit,
}: BookingConfirmationCardProps) => {
  useEffect(() => {
    // Send email notifications when booking is confirmed
    const sendNotifications = async () => {
      if (bookingData.bookingId && bookingData.service && bookingData.date && bookingData.time && bookingData.clientName && bookingData.clientEmail && bookingData.clientPhone) {
        try {
          // Create a booking object for email
          const booking = {
            id: bookingData.bookingId,
            service: bookingData.service,
            date: bookingData.date,
            time: bookingData.time,
            clientName: bookingData.clientName,
            clientEmail: bookingData.clientEmail,
            clientPhone: bookingData.clientPhone,
            clientMessage: bookingData.clientMessage,
            status: 'pending' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Send notifications
          await sendBookingNotifications(booking);
        } catch (error) {
          console.error('Error sending notifications:', error);
        }
      }
    };

    sendNotifications();
  }, [bookingData]);

  const handleAddToCalendar = () => {
    if (!bookingData.date || !bookingData.time || !bookingData.service) return;

    // Create Google Calendar link
    const [year, month, day] = bookingData.date.split('-');
    const [hours, minutes] = bookingData.time.split(':');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      bookingData.service.name
    )}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(
      `Booking for ${bookingData.service.name}\nWith AfriFrame Photography & Videography`
    )}`;

    window.open(googleCalendarUrl, '_blank');
  };

  const handleContactWhatsApp = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '1234567890'; // Format: country code + number (no + or spaces)
    const message = encodeURIComponent(
      `Hi! I just booked ${bookingData.service?.name} for ${bookingData.date} at ${bookingData.time}. Booking ID: ${bookingData.bookingId}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="afri-glass p-8 md:p-12 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-in zoom-in duration-700">
          <CheckCircle className="h-12 w-12 text-green-600 animate-in zoom-in duration-1000" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground text-lg">
          Your cinematic experience is reserved
        </p>
      </div>

      {/* Booking Summary */}
      <div className="mb-8 p-6 rounded-xl bg-card/50 border border-primary/20 space-y-4">
        <div className="text-center pb-4 border-b border-border">
          <h3 className="text-2xl font-bold text-primary mb-2">
            {bookingData.service?.name}
          </h3>
          <p className="text-muted-foreground">{bookingData.service?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-semibold">{bookingData.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-semibold">{bookingData.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-semibold text-sm">{bookingData.clientEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-semibold">{bookingData.clientPhone}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm text-center">
            <span className="font-semibold">Booking Reference:</span>{' '}
            <span className="font-mono text-primary">{bookingData.bookingId}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCalendar}
          variant="outline"
          size="lg"
          className="w-full h-14 text-base border-primary/20 hover:bg-primary/10"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          Add to Google Calendar
        </Button>

        <Button
          onClick={handleContactWhatsApp}
          variant="outline"
          size="lg"
          className="w-full h-14 text-base border-primary/20 hover:bg-primary/10"
        >
          <Phone className="mr-2 h-5 w-5" />
          Contact Us on WhatsApp
        </Button>

        {onPayDeposit && (
          <Button
            onClick={onPayDeposit}
            size="lg"
            className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
          >
            Pay Deposit to Secure Booking
          </Button>
        )}

        <Button
          onClick={onBookAnother}
          variant="ghost"
          size="lg"
          className="w-full h-14 text-base"
        >
          Book Another Service
        </Button>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 rounded-lg bg-card/30 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          ✉️ A confirmation email has been sent to <strong>{bookingData.clientEmail}</strong>.
          <br />
          We will contact you shortly to confirm the details.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmationCard;