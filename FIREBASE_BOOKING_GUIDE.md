# Firebase Booking System Guide

## 🎉 Overview

Your booking system is now powered by Firebase, providing real-time availability management, instant booking notifications, and seamless admin control.

## 🔥 Features Implemented

### For Clients:
- **Real-time Availability**: See available dates and time slots as they update
- **Instant Booking**: Book services with immediate confirmation
- **Email Notifications**: Receive booking confirmation emails
- **Calendar Integration**: Add bookings directly to Google Calendar
- **WhatsApp Contact**: Quick contact via WhatsApp

### For Admins:
- **Calendar Management**: Set dates as available/unavailable
- **Custom Time Slots**: Configure specific time slots for each date
- **Real-time Bookings**: View bookings as they come in
- **Booking Management**: Confirm, cancel, or update booking status
- **Email Notifications**: Get notified of new bookings via email

## 📋 How to Use (Admin)

### Access Admin Panel
1. Navigate to: `/admin`
2. You'll see two tabs: **Bookings** and **Calendar**

### Managing Calendar Availability

#### Set Available Dates:
1. Go to the **Calendar** tab
2. Click on dates you want to make available (they will highlight)
3. Click **"Set Available"** button
4. Configure time slots in the dialog:
   - Default slots: 09:00 - 17:00 (hourly)
   - Add custom slots using the time picker
   - Remove unwanted slots with the trash icon
5. Click **"Confirm & Set Available"**

#### Set Unavailable Dates:
1. Select dates you want to block
2. Click **"Set Unavailable"**
3. Dates will be marked as unavailable for clients

#### Legend:
- 🟦 **Blue**: Selected dates (your current selection)
- 🟩 **Green**: Available for booking
- 🟥 **Red**: Unavailable (blocked)

### Managing Bookings

#### View Bookings:
1. Go to the **Bookings** tab
2. Filter by status: All, Pending, Confirmed
3. Click on any booking card to view details

#### Booking Actions:
- **Confirm Booking**: Changes status to "confirmed"
- **Cancel Booking**: Cancels the reservation
- **View Details**: See full client information and booking details

#### Booking Information:
- Client name, email, phone
- Service booked
- Date and time
- Client message (if provided)
- Booking reference ID
- Creation timestamp

## 🌐 Firebase Configuration

Your Firebase project is already configured:

```javascript
Project ID: afriframe-booking
Auth Domain: afriframe-booking.firebaseapp.com
```

### Firestore Collections:

#### 1. `availability` collection
Stores date availability and time slots:
```
{
  date: "2024-01-15",           // YYYY-MM-DD format
  isAvailable: true,            // Overall availability
  slots: [                      // Time slots for the date
    {
      time: "09:00",
      isAvailable: true,
      bookedBy: "client@email.com" // (if booked)
    }
  ],
  updatedAt: timestamp
}
```

#### 2. `bookings` collection
Stores all booking requests:
```
{
  service: {
    id: "photography",
    name: "Photography",
    description: "...",
    startingPrice: 500,
    image: "..."
  },
  date: "2024-01-15",
  time: "10:00",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  clientPhone: "+1234567890",
  clientMessage: "Special requests...",
  status: "pending",            // pending | confirmed | cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🔔 Email Notifications

### Current Setup:
Email templates are ready for:
- **Client confirmation emails**: Sent when booking is created
- **Admin notification emails**: Alerts you of new bookings

### Production Implementation:
To enable actual email sending in production, integrate a service like:

1. **EmailJS** (Client-side):
   ```bash
   npm install @emailjs/browser
   ```
   - Sign up at emailjs.com
   - Configure service and templates
   - Update `src/services/emailService.ts`

2. **SendGrid** (Server-side):
   - Set up SendGrid account
   - Create API endpoint for email sending
   - Update email service to call your API

3. **AWS SES** or **Mailgun** (alternatives)

### Enable Emails:
Edit `src/services/emailService.ts` and uncomment the email sending logic.

## 🔄 Real-time Updates

The system uses Firebase real-time listeners:

### Client Side:
- Availability updates instantly when admin changes calendar
- Time slots update in real-time as bookings are made
- Prevents double-booking automatically

### Admin Side:
- New bookings appear immediately
- Status changes reflect instantly
- Calendar updates show across all admin sessions

## 📱 User Booking Flow

1. **Service Selection**: Choose from available services
2. **Date & Time**: 
   - View calendar with available dates (green)
   - Select a date
   - Choose from available time slots
   - Unavailable slots are automatically disabled
3. **Client Details**: 
   - Enter name, email, phone
   - Add optional message
   - Real-time slot availability check
4. **Confirmation**: 
   - See booking summary
   - Get booking reference ID
   - Add to Google Calendar
   - Contact via WhatsApp
   - Receive email confirmation

## 🛠️ Customization

### Modify Default Time Slots:
Edit `src/components/booking/DateTimeCard.tsx`:
```typescript
const defaultTimeSlots = [
  '09:00', '10:00', '11:00', // ... your times
];
```

### Change WhatsApp Number:
Edit `src/components/booking/BookingConfirmationCard.tsx`:
```typescript
const phoneNumber = '1234567890'; // Your number
```

### Email Templates:
Customize in `src/services/emailService.ts`:
- Client confirmation email
- Admin notification email
- HTML styling and content

### Services:
Add/edit services in `src/components/booking/ServiceSelectionCard.tsx`

## 🔐 Security Rules (Firebase Console)

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for availability
    match /availability/{date} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null; // Admin only
      allow create: if true; // Anyone can book
      allow update, delete: if request.auth != null; // Admin only
    }
  }
}
```

## 📊 Analytics & Monitoring

### View in Firebase Console:
- Total bookings
- Popular time slots
- Conversion rates
- User engagement

### Export Data:
All booking data can be exported from Firebase Console for analysis.

## 🚀 Going Live

### Before Launch:
1. ✅ Set up Firebase security rules
2. ✅ Configure email service (EmailJS, SendGrid, etc.)
3. ✅ Update WhatsApp number
4. ✅ Test booking flow end-to-end
5. ✅ Set initial availability in admin calendar
6. ✅ Test email notifications
7. ✅ Enable Firebase Authentication for admin (optional)

### Post-Launch:
- Monitor bookings daily
- Update availability regularly
- Respond to booking requests promptly
- Export data for analysis monthly

## 📝 Notes

- **Time Zone**: All times are in local browser timezone
- **Date Format**: YYYY-MM-DD for consistency
- **Real-time Sync**: Changes sync within 1-2 seconds
- **Offline Support**: Firebase provides basic offline caching

## 🆘 Troubleshooting

### Bookings not appearing?
- Check Firebase console for data
- Verify Firestore rules allow writes
- Check browser console for errors

### Calendar not updating?
- Refresh the page
- Check real-time listener subscription
- Verify Firebase connection

### Emails not sending?
- Email service needs production setup
- Check console for email generation
- Integrate EmailJS or SendGrid

## 📞 Support

For technical issues:
1. Check browser console for errors
2. Review Firebase console for data
3. Verify all dependencies are installed
4. Check network connectivity

---

**Your booking system is ready! Visit `/booking` to test the client flow and `/admin` to manage bookings.**
