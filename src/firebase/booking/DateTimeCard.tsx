import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAvailabilityRange, subscribeToAvailability, type AvailabilityDate } from '@/services/availabilityService';
import { toast } from 'sonner';

interface DateTimeCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    image: string;
  };
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}

const DateTimeCard = ({ service, onSelect, onBack }: DateTimeCardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availability, setAvailability] = useState<Map<string, AvailabilityDate>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Default time slots if none are set by admin
  const defaultTimeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    // Calculate date range for current and next 2 months
    const today = new Date();
    const startDate = formatDate(today);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const endDateStr = formatDate(endDate);

    // Subscribe to real-time availability updates
    const unsubscribe = subscribeToAvailability(startDate, endDateStr, (availabilityData) => {
      const availMap = new Map<string, AvailabilityDate>();
      availabilityData.forEach(avail => {
        availMap.set(avail.date, avail);
      });
      setAvailability(availMap);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = formatDate(date);
    const dateAvail = availability.get(dateStr);
    
    // If no availability set, assume available (for initial setup)
    if (!dateAvail) return true;
    
    return dateAvail.isAvailable;
  };

  const getAvailableSlots = (date: Date) => {
    const dateStr = formatDate(date);
    const dateAvail = availability.get(dateStr);
    
    if (!dateAvail || !dateAvail.slots || dateAvail.slots.length === 0) {
      // Return default slots with all available
      return defaultTimeSlots.map(time => ({
        time,
        isAvailable: true
      }));
    }
    
    return dateAvail.slots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime('');
    } else if (date) {
      toast.error('This date is not available. Please select another date.');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect(formatDate(selectedDate), selectedTime);
    }
  };

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <div className="afri-glass p-8 md:p-12 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Services
      </Button>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Select Date & Time
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred date and time for {service.name}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || !isDateAvailable(date);
              }}
              className="rounded-lg border border-primary/20 bg-card/50 p-4"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_disabled: "text-muted-foreground/30 line-through",
                day: "hover:bg-primary/10 transition-colors"
              }}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xl font-semibold mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
                    disabled={!slot.isAvailable}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className={`
                      h-12 transition-all duration-200
                      ${selectedTime === slot.time 
                        ? 'scale-105 shadow-lg shadow-primary/50' 
                        : 'hover:scale-105 hover:shadow-md'
                      }
                      ${!slot.isAvailable ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
              {availableSlots.every(slot => !slot.isAvailable) && (
                <p className="text-center text-muted-foreground mt-4">
                  No available slots for this date. Please select another date.
                </p>
              )}
            </div>
          )}

          {/* Continue Button */}
          {selectedDate && selectedTime && (
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Continue to Details
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeCard;