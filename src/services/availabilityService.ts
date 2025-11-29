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

export interface AvailabilityDate {
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  slots?: TimeSlot[];
  serviceId?: string;
}

export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  bookedBy?: string;
}

export interface Booking {
  id?: string;
  service: {
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    image: string;
  };
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientMessage?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}

// Admin: Set availability for a specific date
export const setDateAvailability = async (
  date: string,
  isAvailable: boolean,
  slots: TimeSlot[] = []
): Promise<void> => {
  const dateRef = doc(db, 'availability', date);
  await setDoc(dateRef, {
    date,
    isAvailable,
    slots,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

// Admin: Batch set availability for multiple dates
export const setBatchAvailability = async (
  dates: string[],
  isAvailable: boolean
): Promise<void> => {
  const promises = dates.map(date => 
    setDateAvailability(date, isAvailable, [])
  );
  await Promise.all(promises);
};

// Get availability for a specific date
export const getDateAvailability = async (date: string): Promise<AvailabilityDate | null> => {
  const dateRef = doc(db, 'availability', date);
  const dateSnap = await getDoc(dateRef);
  
  if (dateSnap.exists()) {
    return dateSnap.data() as AvailabilityDate;
  }
  return null;
};

// Get availability for a date range
export const getAvailabilityRange = async (
  startDate: string,
  endDate: string
): Promise<AvailabilityDate[]> => {
  const availabilityRef = collection(db, 'availability');
  const q = query(
    availabilityRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as AvailabilityDate);
};

// Listen to availability changes in real-time
export const subscribeToAvailability = (
  startDate: string,
  endDate: string,
  callback: (availability: AvailabilityDate[]) => void
): (() => void) => {
  const availabilityRef = collection(db, 'availability');
  const q = query(
    availabilityRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  );
  
  return onSnapshot(q, (snapshot) => {
    const availability = snapshot.docs.map(doc => doc.data() as AvailabilityDate);
    callback(availability);
  });
};

// Book a time slot
export const bookTimeSlot = async (
  date: string,
  time: string,
  clientEmail: string
): Promise<void> => {
  const dateRef = doc(db, 'availability', date);
  const dateSnap = await getDoc(dateRef);
  
  if (dateSnap.exists()) {
    const data = dateSnap.data() as AvailabilityDate;
    const slots = data.slots || [];
    
    const updatedSlots = slots.map(slot => {
      if (slot.time === time) {
        return { ...slot, isAvailable: false, bookedBy: clientEmail };
      }
      return slot;
    });
    
    await updateDoc(dateRef, { slots: updatedSlots, updatedAt: Timestamp.now() });
  }
};

// Create a booking
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  const bookingsRef = collection(db, 'bookings');
  const docRef = await addDoc(bookingsRef, {
    ...booking,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  // Update availability
  await bookTimeSlot(booking.date, booking.time, booking.clientEmail);
  
  return docRef.id;
};

// Get all bookings for admin
export const getAllBookings = async (): Promise<Booking[]> => {
  const bookingsRef = collection(db, 'bookings');
  const querySnapshot = await getDocs(bookingsRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Booking));
};

// Listen to bookings in real-time
export const subscribeToBookings = (
  callback: (bookings: Booking[]) => void
): (() => void) => {
  const bookingsRef = collection(db, 'bookings');
  
  return onSnapshot(bookingsRef, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
    callback(bookings);
  });
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> => {
  const bookingRef = doc(db, 'bookings', bookingId);
  await updateDoc(bookingRef, {
    status,
    updatedAt: Timestamp.now()
  });
};
