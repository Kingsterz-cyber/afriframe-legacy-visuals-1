# 🔐 Firebase Admin Authentication Setup Guide

## Overview
Your admin panel now has proper Firebase Authentication protection. This guide will help you set up admin access.

## ✅ What's Fixed

### 1. **Admin Panel Flash Issue - SOLVED** ✨
- Added proper authentication check with loading state
- Panel only renders after authentication is verified
- Smooth transition without flashing

### 2. **Firebase Authentication - IMPLEMENTED** 🔥
- Replaced Supabase with Firebase Auth
- Session persistence across page refreshes
- Secure admin login/logout flow

## 🚀 Setup Instructions

### Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **afriframe-booking**
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started**
5. Go to **Sign-in method** tab
6. Enable **Email/Password** authentication
7. Click **Save**

### Step 2: Create Your Admin Account

You have **two options** to create an admin account:

#### Option A: Using Firebase Console (Easiest)
1. In Firebase Console → **Authentication** → **Users** tab
2. Click **Add User**
3. Enter:
   - **Email**: your-admin@email.com
   - **Password**: (your secure password)
4. Click **Add User**

#### Option B: Using Firebase CLI (Advanced)
```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create admin user via Firebase Functions
# (You'll need to create a one-time function for this)
```

### Step 3: Test Admin Access

1. **Visit Admin Login Page**: Go to `/admin-login`
2. **Enter Credentials**: Use the email/password you created
3. **Access Admin Panel**: You'll be redirected to `/admin`
4. **Features Available**:
   - ✅ Calendar management
   - ✅ View all bookings
   - ✅ Confirm/cancel bookings
   - ✅ Sign out functionality

### Step 4: Security Rules (Optional but Recommended)

Add Firestore security rules to protect admin data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read availability
    match /availability/{date} {
      allow read: if true; // Public can read availability
      allow write: if request.auth != null; // Only authenticated admin can write
    }
    
    // Protect bookings
    match /bookings/{booking} {
      allow read: if request.auth != null; // Only admin can read
      allow create: if true; // Anyone can create (make booking)
      allow update, delete: if request.auth != null; // Only admin can modify
    }
  }
}
```

**To apply these rules:**
1. Go to Firebase Console → **Firestore Database**
2. Click **Rules** tab
3. Paste the rules above
4. Click **Publish**

## 🔒 Security Features

### Authentication Flow
```
User → /admin → Check Auth → Redirect to /admin-login (if not authenticated)
                          → Show Admin Panel (if authenticated)
```

### Protected Routes
- `/admin` - Requires authentication
- `/admin-login` - Public (login page)
- `/booking` - Public (customer booking)

### Session Management
- Sessions persist across browser refreshes
- Auto-logout on session expiry
- Secure token handling

## 🎯 Usage Guide

### For Admin:

1. **Login**:
   - Navigate to `/admin-login` or click "Admin" in navigation
   - Enter your credentials
   - You'll be redirected to the admin dashboard

2. **Manage Calendar**:
   - Click **Calendar** tab
   - Select dates on the calendar
   - Click "Set Available" to configure time slots
   - Click "Set Unavailable" to block dates

3. **Manage Bookings**:
   - Click **Bookings** tab
   - View all bookings in real-time
   - Filter by: All, Pending, Confirmed
   - Click on any booking to view details
   - Confirm or cancel bookings as needed

4. **Sign Out**:
   - Click the "Sign Out" button in the top-right
   - You'll be redirected to the login page

### For Customers:
- No authentication required
- Can view available dates/times set by admin
- Can book directly without login
- Receive booking confirmation

## 🛠 Troubleshooting

### Issue: "Auth not configured" error
**Solution**: Make sure you've enabled Email/Password authentication in Firebase Console

### Issue: "Cannot sign in"
**Solutions**:
1. Verify the email/password are correct
2. Check if the user exists in Firebase Console → Authentication → Users
3. Ensure Email/Password provider is enabled

### Issue: "Admin panel flashing"
**Solution**: This is now fixed! The panel waits for authentication check before rendering.

### Issue: "Logged out unexpectedly"
**Solution**: Check Firebase Console → Authentication → Settings → Session timeout

## 📝 Default Admin Credentials

⚠️ **IMPORTANT**: You need to create your own admin account using the steps above. There are no default credentials for security reasons.

**Recommended First Admin**:
- Email: `admin@afriframe.com`
- Password: (Choose a strong password)

## 🔐 Password Security Best Practices

1. **Minimum Requirements**:
   - At least 8 characters
   - Mix of uppercase, lowercase, numbers
   - Include special characters

2. **Change Password**:
   - Go to Firebase Console → Authentication → Users
   - Click on user → Reset password
   - Or implement password reset in the app (optional)

## 📱 Admin Features Overview

### Calendar Management
- ✅ Visual calendar interface
- ✅ Multi-date selection
- ✅ Custom time slot configuration
- ✅ Real-time availability updates
- ✅ Color-coded date status

### Booking Management
- ✅ Real-time booking notifications
- ✅ View all booking details
- ✅ Confirm/cancel bookings
- ✅ Filter by status
- ✅ Email notifications (when configured)

### Dashboard Features
- ✅ Logged-in user email display
- ✅ Secure sign-out
- ✅ Tab-based navigation
- ✅ Mobile-responsive design
- ✅ Glass morphism UI

## 🌐 Navigation Integration

Admin access is now available from:
- **Desktop**: "Admin" button in top navigation
- **Mobile**: "Admin Login" in mobile menu
- **Direct URL**: `/admin-login`

## 🎨 UI Features

### Loading States
- Spinner while checking authentication
- Prevents flash of unauthorized content
- Smooth transitions

### Authentication Display
- Shows logged-in email in admin panel
- Clear sign-out button
- Session persistence indicator

## 📈 Next Steps

### Optional Enhancements:

1. **Multi-Admin Support**:
   - Create multiple admin accounts
   - Add role-based permissions

2. **Password Reset**:
   - Implement forgot password flow
   - Email verification

3. **Two-Factor Authentication**:
   - Add extra security layer
   - SMS or authenticator app

4. **Admin Activity Logs**:
   - Track admin actions
   - Audit trail for changes

5. **Email Notifications**:
   - Set up SMTP for admin notifications
   - Booking confirmations
   - Status updates

## 📚 Related Documentation

- Main booking guide: `FIREBASE_BOOKING_GUIDE.md`
- Firebase Auth docs: https://firebase.google.com/docs/auth
- Firestore security: https://firebase.google.com/docs/firestore/security

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration in `src/lib/firebase.ts`
3. Ensure authentication is enabled in Firebase Console
4. Check Firestore rules for permission errors

---

**Your admin panel is now secure and fully functional!** 🎉

Create your admin account and start managing bookings with confidence.
