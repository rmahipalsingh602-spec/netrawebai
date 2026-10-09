import { Resend } from 'resend';
import { Enquiry } from './db/types';

const resendApiKey = process.env.RESEND_API_KEY;
const contactEmail = process.env.CONTACT_EMAIL || 'owner@netrawebai.in';
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Netrawebai <onboarding@resend.dev>';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let resendClient: Resend | null = null;
if (resendApiKey && resendApiKey.trim().length > 0) {
  resendClient = new Resend(resendApiKey.trim());
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Send notification to Netrawebai business owner when a new enquiry is saved.
 */
export async function sendEnquiryNotificationToOwner(enquiry: Enquiry): Promise<EmailResult> {
  const quoteUrl = `${appUrl}/quote/${enquiry.id}?token=${enquiry.accessToken}`;
  const adminUrl = `${appUrl}/admin/enquiries`;

  const subject = `[New Dukaan Enquiry] ${enquiry.enquiryNumber} — ${enquiry.businessName} (${enquiry.customerName})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0B132B; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">Netrawebai — New Website Request</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Har Dukaan Online Initiative</p>
      </div>
      
      <div style="background: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
          <strong style="color: #0f172a;">Enquiry Ref:</strong> <span style="font-family: monospace; color: #2563eb;">${enquiry.enquiryNumber}</span> &bull; 
          <strong>Date:</strong> ${new Date(enquiry.createdAt).toLocaleString()}
        </div>

        <h3 style="font-size: 16px; margin: 0 0 12px; color: #0f172a;">Customer & Business Details:</h3>
        <ul style="padding-left: 20px; margin: 0 0 20px; font-size: 14px;">
          <li><strong>Owner Name:</strong> ${enquiry.customerName}</li>
          <li><strong>Shop Name:</strong> ${enquiry.businessName}</li>
          <li><strong>Trade Category:</strong> ${enquiry.category}</li>
          <li><strong>Phone:</strong> <a href="tel:${enquiry.phone}">${enquiry.phone}</a></li>
          <li><strong>WhatsApp:</strong> <a href="https://wa.me/${enquiry.whatsapp}">+${enquiry.whatsapp}</a></li>
          <li><strong>Email:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></li>
          <li><strong>Package Type:</strong> ${enquiry.packageType?.toUpperCase() || 'CUSTOM'}</li>
          ${enquiry.budgetRange ? `<li><strong>Budget:</strong> ${enquiry.budgetRange}</li>` : ''}
          ${enquiry.targetDate ? `<li><strong>Target Date:</strong> ${enquiry.targetDate}</li>` : ''}
        </ul>

        ${enquiry.productsServices ? `
          <div style="margin-bottom: 16px;">
            <strong style="font-size: 14px;">Products / Services to Display:</strong>
            <p style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 13px; margin: 6px 0 0;">${enquiry.productsServices}</p>
          </div>
        ` : ''}

        ${enquiry.additionalNotes ? `
          <div style="margin-bottom: 20px;">
            <strong style="font-size: 14px;">Additional Requirements:</strong>
            <p style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 13px; margin: 6px 0 0;">${enquiry.additionalNotes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 28px; text-align: center;">
          <a href="${adminUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open Owner Dashboard to Prepare Quote
          </a>
        </div>
      </div>
    </div>
  `;

  if (!resendClient) {
    console.log(`[EMAIL SIMULATION] Owner notification for ${enquiry.enquiryNumber} logged. (Set RESEND_API_KEY to send real emails).`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: contactEmail,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend Error - Owner Notification]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Resend Exception - Owner Notification]:', message);
    return { success: false, error: message };
  }
}

/**
 * Send acknowledgement email to customer with unique quote link and project summary.
 */
export async function sendEnquiryAcknowledgementToCustomer(enquiry: Enquiry): Promise<EmailResult> {
  const quoteUrl = `${appUrl}/quote/${enquiry.id}?token=${enquiry.accessToken}`;
  const whatsappDesk = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919829012345'}?text=${encodeURIComponent(`Hello Netrawebai! I submitted enquiry ${enquiry.enquiryNumber} for ${enquiry.businessName}.`)}`;

  const subject = `Your Website Request Received — Netrawebai (${enquiry.enquiryNumber})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0B132B; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">Netrawebai — हर दुकान ऑनलाइन</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Namaste ${enquiry.customerName} Ji!</p>
      </div>

      <div style="background: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 14px; margin-top: 0;">
          Thank you for trusting <strong>Netrawebai</strong> to bring <strong>${enquiry.businessName}</strong> online! We have safely received your website requirements.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
          <div style="font-weight: bold; color: #15803d; font-size: 14px;">Your Enquiry Reference: ${enquiry.enquiryNumber}</div>
          <div style="font-size: 13px; color: #166534; margin-top: 4px;">Status: <strong>Under Review by Developer</strong></div>
        </div>

        <p style="font-size: 14px;">
          You can track your quote, review scope inclusions, and complete payment using your personal tracking link:
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${quoteUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            View Your Website Quote & Order Status
          </a>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 10px;">
            Want to discuss faster? Tap below to chat directly with our setup specialist on WhatsApp:
          </p>
          <a href="${whatsappDesk}" style="color: #16a34a; font-weight: bold; text-decoration: none;">
            💬 Discuss on WhatsApp with Support Team &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  if (!resendClient) {
    console.log(`[EMAIL SIMULATION] Customer acknowledgement for ${enquiry.email} (${enquiry.enquiryNumber}) logged.`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: enquiry.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend Error - Customer Ack]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Resend Exception - Customer Ack]:', message);
    return { success: false, error: message };
  }
}

/**
 * Send email when quote is prepared or revised by the owner.
 */
export async function sendQuoteNotificationToCustomer(enquiry: Enquiry): Promise<EmailResult> {
  const quoteUrl = `${appUrl}/quote/${enquiry.id}?token=${enquiry.accessToken}`;
  const amountFormatted = enquiry.quotedAmount ? `₹${enquiry.quotedAmount.toLocaleString('en-IN')}` : 'Custom';

  const subject = `Your Website Quote is Ready (${amountFormatted}) — Netrawebai (${enquiry.enquiryNumber})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0B132B; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">Netrawebai — Your Quote is Ready!</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">${enquiry.businessName} Website Project</p>
      </div>

      <div style="background: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 14px; margin-top: 0;">
          Namaste ${enquiry.customerName} Ji, our design team has reviewed your requirements and prepared an official quote.
        </p>

        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 8px; margin: 20px 0;">
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Approved Project Total</div>
          <div style="font-size: 28px; font-weight: 900; color: #0f172a; margin: 4px 0 10px;">${amountFormatted}</div>
          <div style="font-size: 13px; color: #334155;"><strong>Deliverables:</strong> ${enquiry.quoteScope || 'Complete responsive website setup with 1-year hosting'}</div>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${quoteUrl}" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
            Review & Accept Quote to Pay Securely
          </a>
        </div>
      </div>
    </div>
  `;

  if (!resendClient) {
    console.log(`[EMAIL SIMULATION] Quote notification for ${enquiry.email} logged.`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: enquiry.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend Error - Quote Ready]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Resend Exception - Quote Ready]:', message);
    return { success: false, error: message };
  }
}

/**
 * Send payment receipt confirmation email upon successful payment capture.
 */
export async function sendPaymentReceiptEmail(enquiry: Enquiry, amount: number, paymentId: string): Promise<EmailResult> {
  const quoteUrl = `${appUrl}/quote/${enquiry.id}?token=${enquiry.accessToken}`;
  const subject = `Payment Confirmed (₹${amount.toLocaleString('en-IN')}) — Netrawebai (${enquiry.enquiryNumber})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
      <div style="background: #0B132B; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">Payment Successful! 🎉</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">${enquiry.businessName} is going online!</p>
      </div>

      <div style="background: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 14px; margin-top: 0;">
          We have received your payment of <strong>₹${amount.toLocaleString('en-IN')}</strong>. Our development team has now begun deploying your shop storefront.
        </p>

        <div style="background: #f1f5f9; padding: 14px 18px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
          <div><strong>Payment ID:</strong> <span style="font-family: monospace;">${paymentId}</span></div>
          <div><strong>Enquiry No:</strong> <span style="font-family: monospace;">${enquiry.enquiryNumber}</span></div>
          <div><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleString()}</div>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${quoteUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            Track Your Deployment Progress
          </a>
        </div>
      </div>
    </div>
  `;

  if (!resendClient) {
    console.log(`[EMAIL SIMULATION] Payment receipt for ${enquiry.email} (₹${amount}) logged.`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: enquiry.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Resend Error - Payment Receipt]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Resend Exception - Payment Receipt]:', message);
    return { success: false, error: message };
  }
}

export const sendQuoteReadyToCustomer = sendQuoteNotificationToCustomer;

export async function sendPaymentReceiptToCustomer(
  enquiry: Enquiry,
  payment: { amount: number; razorpayPaymentId?: string | null; id?: string; [key: string]: unknown }
): Promise<EmailResult> {
  const paymentId = payment.razorpayPaymentId || payment.id || 'N/A';
  return sendPaymentReceiptEmail(enquiry, payment.amount, paymentId);
}

