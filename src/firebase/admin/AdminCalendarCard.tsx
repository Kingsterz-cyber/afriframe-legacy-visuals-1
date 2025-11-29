import { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';

interface Booking {
  id: string;
  booking_date: string;
  status: string;
  services: {
    name: string;
  };
}

interface AdminCalendarCardProps {
  bookings: Booking[];
  onDateClick: (date: Date, bookings: Booking[]) => void;
}

const AdminCalendarCard = ({ bookings, onDateClick }: AdminCalendarCardProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayBookings = bookings.filter((booking) =>
        isSameDay(parseISO(booking.booking_date), cloneDay)
      );

      const freeSlots = dayBookings.filter((b) => b.status === 'available');
      const blockedSlots = dayBookings.filter((b) => b.status === 'blocked');
      const bookedSlots = dayBookings.filter(
        (b) => b.status === 'confirmed' || b.status === 'pending'
      );

      days.push(
        <div
          key={day.toString()}
          className={`min-h-24 p-2 border border-foreground/10 transition-all cursor-pointer ${
            !isSameMonth(day, monthStart)
              ? 'bg-muted/20 text-muted-foreground'
              : 'hover:bg-accent/50'
          }`}
          onClick={() => onDateClick(cloneDay, dayBookings)}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-sm font-medium ${
                isSameDay(day, new Date())
                  ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center'
                  : ''
              }`}
            >
              {format(day, 'd')}
            </span>
          </div>
          
          {/* Booking Status Dots */}
          <div className="flex flex-wrap gap-1">
            {freeSlots.length > 0 && (
              <div className="flex items-center gap-1" title={`${freeSlots.length} free slots`}>
                <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                <span className="text-xs text-green-500">{freeSlots.length}</span>
              </div>
            )}
            {blockedSlots.length > 0 && (
              <div className="flex items-center gap-1" title={`${blockedSlots.length} blocked`}>
                <Circle className="w-3 h-3 fill-muted-foreground text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{blockedSlots.length}</span>
              </div>
            )}
            {bookedSlots.length > 0 && (
              <div className="flex items-center gap-1" title={`${bookedSlots.length} booked`}>
                <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
                <span className="text-xs text-blue-500">{bookedSlots.length}</span>
              </div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="afri-glass p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
          <span className="text-muted-foreground">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 fill-muted-foreground text-muted-foreground" />
          <span className="text-muted-foreground">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-0">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Rows */}
        {rows}
      </div>
    </div>
  );
};

export default AdminCalendarCard;
