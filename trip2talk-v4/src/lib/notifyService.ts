// Twilio SMS + Resend Email notification dispatcher
// All sends go through Supabase Edge Functions - never expose keys to client
import { supabase } from './supabase';

export interface NotifyResult { success: boolean; sid?: string; error?: string; }

// SMS via Twilio (Edge Function)
export async function sendSMS(to: string, message: string): Promise<NotifyResult> {
  const { data, error } = await supabase.functions.invoke('twilio-send-sms', {
    body: { to, message },
  });
  if (error) return { success: false, error: error.message };
  return { success: true, sid: data?.sid };
}

// Email via Resend (Edge Function)
export async function sendEmail(params: {
  to: string; subject: string; html: string; attachments?: { filename: string; url: string }[];
}): Promise<NotifyResult> {
  const { data, error } = await supabase.functions.invoke('resend-send-email', {
    body: params,
  });
  if (error) return { success: false, error: error.message };
  return { success: true, sid: data?.id };
}

// 24h Safety Brief SMS to Owner
export async function sendSafetyBriefAlert(params: {
  ownerPhone: string; tourCode: string; departureDate: string;
  customerCount: number; flaggedCount: number;
}): Promise<NotifyResult> {
  const msg = [
    `TRIP2TALK SAFETY BRIEF`,
    `Tour: ${params.tourCode}`,
    `Departs: ${params.departureDate}`,
    `Passengers: ${params.customerCount}`,
    `Medical flags: ${params.flaggedCount}`,
    `Review medical notes in Owner Hub before departure.`,
  ].join('\n');
  return sendSMS(params.ownerPhone, msg);
}

// Asset Expiry Alert SMS
export async function sendAssetExpiryAlert(params: {
  ownerPhone: string; assetName: string; expiryDate: string; daysLeft: number;
}): Promise<NotifyResult> {
  const urgency = params.daysLeft <= 7 ? 'URGENT' : 'WARNING';
  const msg = [
    `${urgency} - TRIP2TALK`,
    `${params.assetName} expires on ${params.expiryDate}`,
    `${params.daysLeft} days remaining.`,
    `Renew immediately to avoid trip creation being blocked.`,
  ].join('\n');
  return sendSMS(params.ownerPhone, msg);
}

// Booking Confirmation Email to Customer
export async function sendBookingConfirmation(params: {
  customerEmail: string; customerName: string; bookingRef: string;
  tourTitle: string; departureDate: string; totalPrice: number;
  depositPaid: number; contractPdfUrl?: string;
}): Promise<NotifyResult> {
  const html = `
    <div style="font-family:Georgia,serif;background:#0a0a0a;color:#fff;padding:40px;max-width:600px;margin:0 auto">
      <h1 style="color:#D4AF37;letter-spacing:0.2em;font-size:1.5rem">TRIP2TALK</h1>
      <p style="color:#aaa;font-size:0.85rem;letter-spacing:0.1em">PREMIUM PHOTOGRAPHY TOURS · AUSTRALIA</p>
      <hr style="border-color:#D4AF3730;margin:20px 0"/>
      <h2 style="color:#fff">Booking Confirmed</h2>
      <p>Dear ${params.customerName},</p>
      <p>Your booking <strong style="color:#D4AF37">${params.bookingRef}</strong> has been confirmed.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tr><td style="padding:8px;color:#aaa">Tour</td><td style="padding:8px;color:#fff">${params.tourTitle}</td></tr>
        <tr><td style="padding:8px;color:#aaa">Departure</td><td style="padding:8px;color:#fff">${params.departureDate}</td></tr>
        <tr><td style="padding:8px;color:#aaa">Total Price</td><td style="padding:8px;color:#fff">AUD $${params.totalPrice.toFixed(2)}</td></tr>
        <tr><td style="padding:8px;color:#aaa">Deposit Paid</td><td style="padding:8px;color:#D4AF37">AUD $${params.depositPaid.toFixed(2)} (Non-refundable)</td></tr>
        <tr><td style="padding:8px;color:#aaa">Balance Due</td><td style="padding:8px;color:#fff">AUD $${(params.totalPrice - params.depositPaid).toFixed(2)}</td></tr>
      </table>
      ${params.contractPdfUrl ? `<p><a href="${params.contractPdfUrl}" style="color:#D4AF37">Download Booking Contract (PDF)</a></p>` : ''}
      <p style="color:#aaa;font-size:0.8rem">Please note: The $100 deposit is strictly non-refundable under all circumstances. Tours depart within 15 minutes of scheduled time.</p>
    </div>
  `;
  return sendEmail({
    to:      params.customerEmail,
    subject: `Trip2Talk Booking Confirmed - ${params.bookingRef}`,
    html,
    attachments: params.contractPdfUrl
      ? [{ filename: `${params.bookingRef}_Contract.pdf`, url: params.contractPdfUrl }]
      : undefined,
  });
}
