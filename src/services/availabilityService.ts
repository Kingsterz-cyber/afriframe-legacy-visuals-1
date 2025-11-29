// src/services/availabilityService.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ------------------ TYPES ------------------

export interface TimeSlot {
  time: string; // HH:mm
  isAvailable: boolean;
  bookedBy?: string;
}

export interface AvailabilityDate {
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  slots?: TimeSlot[];
}

export interface Booking {
  id?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientMessage?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

// ------------------ AVAILABILITY ------------------

// Set availability for a single date
export const setDateAvailability = async (
  date: string,
  isAvailable: boolean,
  slots: TimeSlot[] = []
): Promise<void> => {
  try {
    const dateRef = doc(db, 'calendar', date);
    await setDoc(
      dateRef,
      {
        date,
        isAvailable,
        slots,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );
    console.log('✅ Date availability set:', date);
  } catch (error) {
    console.error('❌ Error setting date availability:', error);
    throw error;
  }
};

// Batch set availability
export const setBatchAvailability = async (
  dates: string[],
  isAvailable: boolean
): Promise<void> => {
  try {
    await Promise.all(dates.map((date) => setDateAvailability(date, isAvailable)));
    console.log('✅ Batch availability set');
  } catch (error) {
    console.error('❌ Error setting batch availability:', error);
    throw error;
  }
};

// Get availability for a specific date
export const getDateAvailability = async (date: string): Promise<AvailabilityDate | null> => {
  try {
    const dateRef = doc(db, 'calendar', date);
    const snap = await getDoc(dateRef);
    return snap.exists() ? (snap.data() as AvailabilityDate) : null;
  } catch (error) {
    console.error('❌ Error getting date availability:', error);
    throw error;
  }
};

// Get availability in a range
export const getAvailabilityRange = async (
  startDate: string,
  endDate: string
): Promise<AvailabilityDate[]> => {
  try {
    const calendarRef = collection(db, 'calendar');
    const q = query(calendarRef, where('date', '>=', startDate), where('date', '<=', endDate));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as AvailabilityDate);
  } catch (error) {
    console.error('❌ Error getting availability range:', error);
    throw error;
  }
};

// Subscribe to availability changes in real-time
export const subscribeToAvailability = (
  startDate: string,
  endDate: string,
  callback: (availability: AvailabilityDate[]) => void
): (() => void) => {
  const calendarRef = collection(db, 'calendar');
  const q = query(calendarRef, where('date', '>=', startDate), where('date', '<=', endDate));

  return onSnapshot(
    q,
    (snapshot) => {
      const availability = snapshot.docs.map((doc) => doc.data() as AvailabilityDate);
      callback(availability);
      console.log('📅 Calendar updated:', availability.length, 'dates');
    },
    (error) => console.error('❌ Calendar subscription error:', error)
  );
};

// ------------------ TIME SLOT BOOKING ------------------

// Book a single time slot
export const bookTimeSlot = async (
  date: string,
  time: string,
  clientEmail: string
): Promise<void> => {
  const dateRef = doc(db, 'calendar', date);
  const snap = await getDoc(dateRef);

  if (!snap.exists()) {
    // Create new date entry if missing
    await setDoc(dateRef, {
      date,
      isAvailable: true,
      slots: [
        { time, isAvailable: false, bookedBy: clientEmail }
      ],
      updatedAt: Timestamp.now(),
    });
    console.log('✅ New calendar date created with booked slot:', date, time);
    return;
  }

  const data = snap.data() as AvailabilityDate;
  const slots = data.slots || [];

  // Update existing slot or add new slot
  const updatedSlots: TimeSlot[] = slots.map((s) =>
    s.time === time ? { ...s, isAvailable: false, bookedBy: clientEmail } : s
  );

  if (!slots.find((s) => s.time === time)) {
    updatedSlots.push({ time, isAvailable: false, bookedBy: clientEmail });
  }

  await updateDoc(dateRef, { slots: updatedSlots, updatedAt: Timestamp.now() });
  console.log('✅ Time slot booked:', date, time);
};

// ------------------ BOOKINGS ------------------

// Create a booking
export const createBooking = async (booking: Booking): Promise<string> => {
  try {
    console.log('📝 Creating booking:', booking);

    // Only plain JSON data
    const cleanBooking = {
      serviceId: String(booking.serviceId),
      serviceName: String(booking.serviceName),
      date: String(booking.date),
      time: String(booking.time),
      clientName: String(booking.clientName),
      clientEmail: String(booking.clientEmail),
      clientPhone: String(booking.clientPhone),
      clientMessage: booking.clientMessage || '',
      status: booking.status,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, cleanBooking);

    // Update calendar slot
    await bookTimeSlot(booking.date, booking.time, booking.clientEmail);

    console.log('✅ Booking created with ID:', docRef.id);
    return docRef.id;

  } catch (error) {
    console.error('❌ Failed to create booking:', error);
    throw new Error('Booking failed. Please try again.');
  }
};

// Get all bookings (admin)
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error('❌ Error getting bookings:', error);
    throw error;
  }
};

// Subscribe to bookings in real-time
export const subscribeToBookings = (
  callback: (bookings: Booking[]) => void
): (() => void) => {
  const bookingsRef = collection(db, 'bookings');
  return onSnapshot(
    bookingsRef,
    (snapshot) => {
      const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
      callback(bookings);
      console.log('📋 Bookings updated:', bookings.length);
    },
    (error) => console.error('❌ Bookings subscription error:', error)
  );
};

// Update booking status (admin)
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status, updatedAt: Timestamp.now() });
    console.log('✅ Booking status updated:', bookingId, status);
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    throw error;
  }
};
