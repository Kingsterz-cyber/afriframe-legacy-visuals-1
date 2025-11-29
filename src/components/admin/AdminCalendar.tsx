import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  setDateAvailability,
  setBatchAvailability,
  subscribeToAvailability,
  type AvailabilityDate,
  type TimeSlot,
} from '@/services/availabilityService';
import { Plus, Trash2, Check, X } from 'lucide-react';

const AdminCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availability, setAvailability] = useState<Map<string, AvailabilityDate>>(new Map());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: '09:00', isAvailable: true },
    { time: '10:00', isAvailable: true },
    { time: '11:00', isAvailable: true },
    { time: '12:00', isAvailable: true },
    { time: '13:00', isAvailable: true },
    { time: '14:00', isAvailable: true },
    { time: '15:00', isAvailable: true },
    { time: '16:00', isAvailable: true },
    { time: '17:00', isAvailable: true },
  ]);
  const [newSlotTime, setNewSlotTime] = useState('');

  useEffect(() => {
    const today = new Date();
    const startDate = formatDate(today);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const endDateStr = formatDate(endDate);

    const unsubscribe = subscribeToAvailability(startDate, endDateStr, (availabilityData) => {
      const availMap = new Map<string, AvailabilityDate>();
      availabilityData.forEach(avail => {
        availMap.set(avail.date, avail);
      });
      setAvailability(availMap);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date: Date) => {
    const exists = selectedDates.some(d => formatDate(d) === formatDate(date));
    if (exists) {
      setSelectedDates(selectedDates.filter(d => formatDate(d) !== formatDate(date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSetAvailable = async () => {
    if (selectedDates.length === 0) {
      toast.error('Please select at least one date');
      return;
    }

    try {
      const dateStrings = selectedDates.map(formatDate);
      await Promise.all(
        dateStrings.map(date => setDateAvailability(date, true, timeSlots))
      );
      toast.success(`${selectedDates.length} date(s) marked as available`);
      setSelectedDates([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error setting availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleSetUnavailable = async () => {
    if (selectedDates.length === 0) {
      toast.error('Please select at least one date');
      return;
    }

    try {
      const dateStrings = selectedDates.map(formatDate);
      await setBatchAvailability(dateStrings, false);
      toast.success(`${selectedDates.length} date(s) marked as unavailable`);
      setSelectedDates([]);
    } catch (error) {
      console.error('Error setting availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleAddTimeSlot = () => {
    if (!newSlotTime) {
      toast.error('Please enter a time');
      return;
    }

    const exists = timeSlots.some(slot => slot.time === newSlotTime);
    if (exists) {
      toast.error('This time slot already exists');
      return;
    }

    setTimeSlots([...timeSlots, { time: newSlotTime, isAvailable: true }].sort((a, b) => 
      a.time.localeCompare(b.time)
    ));
    setNewSlotTime('');
  };

  const handleRemoveTimeSlot = (time: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.time !== time));
  };

  const getDateStatus = (date: Date): 'available' | 'unavailable' | 'selected' | null => {
    if (selectedDates.some(d => formatDate(d) === formatDate(date))) {
      return 'selected';
    }
    const dateStr = formatDate(date);
    const dateAvail = availability.get(dateStr);
    if (!dateAvail) return null;
    return dateAvail.isAvailable ? 'available' : 'unavailable';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
        <p className="text-muted-foreground mb-6">
          Select dates and mark them as available or unavailable for bookings
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={selectedDates.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Set Available ({selectedDates.length})
          </Button>
          <Button
            onClick={handleSetUnavailable}
            disabled={selectedDates.length === 0}
            variant="destructive"
          >
            <X className="mr-2 h-4 w-4" />
            Set Unavailable ({selectedDates.length})
          </Button>
          {selectedDates.length > 0 && (
            <Button
              onClick={() => setSelectedDates([])}
              variant="outline"
            >
              Clear Selection
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            onDayClick={handleDateClick}
            className="rounded-lg border"
            classNames={{
              day: "hover:bg-primary/10 transition-colors cursor-pointer",
            }}
            modifiers={{
              selected: selectedDates,
              available: (date) => {
                const status = getDateStatus(date);
                return status === 'available';
              },
              unavailable: (date) => {
                const status = getDateStatus(date);
                return status === 'unavailable';
              },
            }}
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground hover:bg-primary",
              available: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
              unavailable: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100 line-through",
            }}
          />
        </div>

        <div className="mt-6 p-4 bg-card/50 rounded-lg border">
          <h3 className="font-semibold mb-2">Legend:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span>Selected dates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded" />
              <span>Available for booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Slots Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Time Slots</DialogTitle>
            <DialogDescription>
              Configure available time slots for the selected dates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Time Slots</Label>
              <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.time}
                    className="flex items-center justify-between p-2 bg-card rounded border"
                  >
                    <span className="text-sm">{slot.time}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveTimeSlot(slot.time)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="Add time slot"
              />
              <Button onClick={handleAddTimeSlot} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleSetAvailable} className="w-full">
              Confirm & Set Available
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
