import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import type { BookingData } from './BookingFlow';

interface PaymentCardProps {
  bookingData: BookingData;
  onComplete: () => void;
}

const PaymentCard = ({ bookingData, onComplete }: PaymentCardProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const depositAmount = bookingData.service?.startingPrice 
    ? Math.round(bookingData.service.startingPrice * 0.3) 
    : 0;

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Fast & Secure' },
    { id: 'mpesa', name: 'M-Pesa', icon: '📱', description: 'Mobile Money' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setPaymentComplete(true);

    // Wait for animation then complete
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="afri-glass p-6 md:p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4 animate-in zoom-in-50 duration-500">
          <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Payment Received!</h2>
        <p className="text-muted-foreground mb-6">
          Your deposit of <span className="text-primary font-semibold">${depositAmount}</span> has been processed successfully
        </p>
        <div className="w-16 h-1 bg-primary rounded-full mx-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="afri-glass p-6 md:p-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Secure Your Spot
        </h2>
        <p className="text-muted-foreground">
          Pay a deposit to confirm your booking
        </p>
      </div>

      {/* Amount Display */}
      <div className="mb-8 p-6 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm text-muted-foreground mb-2">Deposit Amount (30%)</p>
        <p className="text-4xl font-bold text-primary mb-2">${depositAmount}</p>
        <p className="text-xs text-muted-foreground">
          Full amount: ${bookingData.service?.startingPrice}
        </p>
      </div>

      {/* Booking Summary */}
      <div className="mb-8 p-4 rounded-lg bg-accent/50 border border-accent">
        <h3 className="font-semibold mb-2 text-sm">Payment For</h3>
        <div className="space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="text-muted-foreground">Booking ID:</span>
            <span className="font-mono">{bookingData.bookingId}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span>{bookingData.service?.name}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{bookingData.date}</span>
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                selectedMethod === method.id
                  ? 'border-primary bg-primary/10 scale-[1.02]'
                  : 'border-foreground/10 hover:border-foreground/30 hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{method.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={!selectedMethod || processing}
        size="lg"
        className="w-full transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ${depositAmount} Now
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-xs text-muted-foreground">
          🔒 Your payment is secured with 256-bit SSL encryption
        </p>
      </div>

      {/* Skip Option */}
      <button
        onClick={onComplete}
        className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Skip for now, pay later
      </button>
    </div>
  );
};

export default PaymentCard;
