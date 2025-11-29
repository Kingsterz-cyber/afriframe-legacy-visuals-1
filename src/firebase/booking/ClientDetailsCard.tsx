import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { createBooking } from '@/services/availabilityService'
import { toast } from 'sonner'
import type { BookingData } from './BookingFlow'

interface ClientDetailsCardProps {
  bookingData: BookingData
  onSubmit: (details: {
    name: string
    email: string
    phone: string
    message: string
  }) => void
  onBack: () => void
}

const ClientDetailsCard = ({ bookingData, onSubmit, onBack }: ClientDetailsCardProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slotStatus, setSlotStatus] = useState<'available' | 'taken' | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      toast.error('Missing booking information')
      return
    }

    setIsSubmitting(true)

    try {
      // ✅ Sanitized safe booking data
      const cleanBooking = {
        serviceId: bookingData.service.id ?? 'unknown',
        serviceName: bookingData.service.name ?? 'Unknown Service',
        date: String(bookingData.date),   // convert to string
        time: String(bookingData.time),   // convert to string
        clientName: String(formData.name),
        clientEmail: String(formData.email),
        clientPhone: String(formData.phone),
        clientMessage: String(formData.message ?? ''),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const bookingId = await createBooking(cleanBooking)

      toast.success('Booking created successfully!')
      setSlotStatus('available')

      // Pass details back
      onSubmit({ ...formData })

      // Save booking ID
      bookingData.bookingId = bookingId

    } catch (error: any) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Slot may be taken.')
      setSlotStatus('taken')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="afri-glass p-8 md:p-12 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">

      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 -ml-2 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Date & Time
      </Button>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Details
        </h2>
        <p className="text-muted-foreground">
          Please provide your contact information
        </p>
      </div>

      {/* Booking Summary */}
      <div className="mb-8 p-6 rounded-xl bg-card/50 border border-primary/20">
        <h3 className="font-semibold mb-4 text-lg">Booking Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">
              {bookingData.service?.name || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{bookingData.date}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{bookingData.time}</span>
          </div>
        </div>

        {slotStatus && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              slotStatus === 'available'
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}
          >
            {slotStatus === 'available' ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Slot is available!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Slot was taken. Choose another time.
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+250..."
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Additional Notes</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any special requests..."
            className="min-h-[120px] resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </form>
    </div>
  )
}

export default ClientDetailsCard
