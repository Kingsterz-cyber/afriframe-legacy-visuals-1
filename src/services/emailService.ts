import emailjs from "@emailjs/browser";
import type { Booking } from "./availabilityService";

const SERVICE_ID = "service_f8q4jek";
const TEMPLATE_ID_CLIENT = "template_4yy63zn"; // your client template ID
const PUBLIC_KEY = "sEGX1s12eI4M8VcNb";

// Send email to client
export const sendClientBookingConfirmation = async (booking: Booking) => {
  if (!booking.clientEmail) throw new Error("Client email missing");

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID_CLIENT,
    {
      email: booking.clientEmail,
      client_name: booking.clientName || "Client",
      service_name: booking.service?.name || booking.serviceName || "Service",
      booking_date: booking.date || "N/A",
      booking_time: booking.time || "N/A",
      amount: "$18",
    },
    PUBLIC_KEY
  );
};
