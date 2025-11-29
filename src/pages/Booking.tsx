import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BookingFlow from '@/firebase/booking/BookingFlow';

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <BookingFlow />
      </main>

      <Footer />
    </div>
  );
};

export default Booking;