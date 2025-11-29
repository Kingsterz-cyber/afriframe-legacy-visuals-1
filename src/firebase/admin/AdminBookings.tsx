import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  subscribeToBookings,
  updateBookingStatus,
  type Booking,
} from '@/services/availabilityService';
import { Calendar, Clock, Mail, Phone, User, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    const unsubscribe = subscribeToBookings((bookingsData) => {
      // Sort by creation date (newest first)
      const sorted = bookingsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setBookings(sorted);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status}!`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusDisplay = (status?: string): string => {
    return (status || 'pending').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Bookings</h2>
            <p className="text-muted-foreground">
              Manage and view all booking requests
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({bookings.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'confirmed' ? 'default' : 'outline'}
              onClick={() => setFilter('confirmed')}
              size="sm"
            >
              Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
            </Button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedBooking(booking);
                  setIsDialogOpen(true);
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{booking.service?.name || booking.serviceName || 'Service'}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusDisplay(booking.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{booking.clientName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{booking.clientEmail || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{booking.clientPhone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time || 'N/A'}</span>
                      </div>
                    </div>

                    {booking.clientMessage && (
                      <p className="text-sm text-muted-foreground italic">
                        "{booking.clientMessage}"
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Booked on: {formatDate(booking.createdAt)}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBooking(booking);
                      setIsDialogOpen(true);
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View and manage this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedBooking.service?.name || selectedBooking.serviceName || 'Service'}</h3>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusDisplay(selectedBooking.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-card/50 rounded-lg border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Client Name</p>
                    <p className="font-medium">{selectedBooking.clientName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-sm">{selectedBooking.clientEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{selectedBooking.clientPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">{selectedBooking.date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time</p>
                    <p className="font-medium">{selectedBooking.time || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="font-medium">${selectedBooking.service?.startingPrice || selectedBooking.price || 'N/A'}</p>
                  </div>
                </div>

                {selectedBooking.clientMessage && (
                  <div className="p-4 bg-card/50 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Message</p>
                    <p className="text-sm">{selectedBooking.clientMessage}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>Booking ID: {selectedBooking.id}</p>
                  <p>Created: {formatDate(selectedBooking.createdAt)}</p>
                  {selectedBooking.updatedAt && (
                    <p>Last Updated: {formatDate(selectedBooking.updatedAt)}</p>
                  )}
                </div>
              </div>

              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => selectedBooking.id && handleStatusChange(selectedBooking.id, 'confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                  <Button
                    onClick={() => selectedBooking.id && handleStatusChange(selectedBooking.id, 'cancelled')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;