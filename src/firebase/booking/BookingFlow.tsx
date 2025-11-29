import { useState } from 'react';
import ServiceSelectionCard from './ServiceSelectionCard';
import DateTimeCard from './DateTimeCard';
import ClientDetailsCard from './ClientDetailsCard';
import BookingConfirmationCard from './BookingConfirmationCard';
import PaymentCard from './PaymentCard';

export type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation' | 'payment';

export interface BookingData {
  service?: {
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    image: string;
  };
  date?: string;
  time?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientMessage?: string;
  bookingId?: string;
}

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [bookingData, setBookingData] = useState<BookingData>({});

  const handleServiceSelect = (service: BookingData['service']) => {
    setBookingData({ ...bookingData, service });
    setCurrentStep('datetime');
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData({ ...bookingData, date, time });
    setCurrentStep('details');
  };

  const handleClientDetailsSubmit = (details: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    setBookingData({
      ...bookingData,
      clientName: details.name,
      clientEmail: details.email,
      clientPhone: details.phone,
      clientMessage: details.message,
    });
    setCurrentStep('confirmation');
  };

  const handleConfirmation = (bookingId: string) => {
    setBookingData({ ...bookingData, bookingId });
  };

  const handlePaymentComplete = () => {
    setCurrentStep('confirmation');
  };

  const handleBookAnother = () => {
    setBookingData({});
    setCurrentStep('service');
  };

  const handleBackToDateTime = () => {
    setCurrentStep('datetime');
  };

  const handleBackToService = () => {
    setCurrentStep('service');
  };

  const handlePayDeposit = () => {
    setCurrentStep('payment');
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Progress Indicator */}
        <div className="mb-12 flex justify-center items-center gap-2">
          {(['service', 'datetime', 'details', 'confirmation'] as const).map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground scale-110'
                    : index < ['service', 'datetime', 'details', 'confirmation'].indexOf(currentStep)
                    ? 'bg-primary/50 text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    index < ['service', 'datetime', 'details', 'confirmation'].indexOf(currentStep)
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card Steps */}
        <div className="relative">
          {currentStep === 'service' && (
            <ServiceSelectionCard onSelect={handleServiceSelect} />
          )}

          {currentStep === 'datetime' && bookingData.service && (
            <DateTimeCard
              service={bookingData.service}
              onSelect={handleDateTimeSelect}
              onBack={handleBackToService}
            />
          )}

          {currentStep === 'details' && bookingData.service && bookingData.date && (
            <ClientDetailsCard
              bookingData={bookingData}
              onSubmit={handleClientDetailsSubmit}
              onBack={handleBackToDateTime}
            />
          )}

          {currentStep === 'confirmation' && bookingData.bookingId && (
            <BookingConfirmationCard
              bookingData={bookingData}
              onBookAnother={handleBookAnother}
              onPayDeposit={handlePayDeposit}
            />
          )}

          {currentStep === 'payment' && bookingData.bookingId && (
            <PaymentCard
              bookingData={bookingData}
              onComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
