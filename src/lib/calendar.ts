import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CalendarDoc, TimeSlot } from '@/types';

export const getCalendar = async (date: string): Promise<CalendarDoc | null> => {
  try {
    const docRef = doc(db, 'calendar', date);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as CalendarDoc;
    }
    return null;
  } catch (error) {
    console.error('Error getting calendar:', error);
    throw error;
  }
};

export const updateCalendar = async (
  date: string,
  updates: Partial<CalendarDoc>
): Promise<void> => {
  try {
    const docRef = doc(db, 'calendar', date);
    await setDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating calendar:', error);
    throw error;
  }
};

export const subscribeToCalendar = (
  callback: (calendar: CalendarDoc[]) => void
): (() => void) => {
  const calendarRef = collection(db, 'calendar');

  return onSnapshot(calendarRef, (snapshot) => {
    const calendar = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as CalendarDoc));
    callback(calendar);
  }, (error) => {
    console.error('Error in calendar subscription:', error);
  });
};

export const generateDefaultSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: true
    });
  }
  return slots;
};

export const isPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isAvailable = (calendarDoc: CalendarDoc | null): boolean => {
  if (!calendarDoc) return true; // Default to available
  return calendarDoc.available && (calendarDoc.slots?.some(slot => slot.available) ?? true);
};
