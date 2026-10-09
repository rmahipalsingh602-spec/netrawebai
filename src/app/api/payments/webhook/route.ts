import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyWebhookSignature 
} from '@/server/payments';
import { 
  isWebhookProcessed, 
  logWebhook, 
  getPaymentByRazorpayOrderId, 
  updatePayment, 
  updateOrder, 
  getEnquiryById, 
  updateEnquiry 
} from '@/server/db/repository';
import { sendPaymentReceiptToCustomer } from '@/server/email';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // 1. Verify Webhook Signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Razorpay Webhook Signature Mismatch]: Request rejected.');
      return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventId = event?.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const eventType = event?.event || 'unknown';

    // 2. Idempotency Check
    const alreadyProcessed = await isWebhookProcessed(eventId);
    if (alreadyProcessed) {
      console.log(`[Webhook Idempotency]: Event ${eventId} was already processed.`);
      return NextResponse.json({ status: 'ok', idempotent: true });
    }

    // Log the event immediately to guarantee idempotency on retry
    await logWebhook(eventId, eventType, event);

    // 3. Handle Events
    if (eventType === 'payment.captured') {
      const paymentEntity = event?.payload?.payment?.entity;
      if (paymentEntity) {
        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;
        const method = paymentEntity.method;
        const email = paymentEntity.email;
        const contact = paymentEntity.contact;
        const now = new Date().toISOString();

        if (razorpayOrderId) {
          const payment = await getPaymentByRazorpayOrderId(razorpayOrderId);
          if (payment) {
            await updatePayment(payment.id, {
              status: 'captured',
              razorpayPaymentId,
              method,
              updatedAt: now,
            });

            if (payment.orderId) {
              await updateOrder(payment.orderId, {
                status: 'paid',
                updatedAt: now,
              });
            }

            const enquiry = await getEnquiryById(payment.enquiryId);
            if (enquiry && enquiry.paymentStatus !== 'paid') {
              const updatedEnquiry = await updateEnquiry(enquiry.id, {
                paymentStatus: 'paid',
                paidAmount: payment.amount,
                paidAt: now,
                razorpayPaymentId,
                razorpayOrderId,
                status: 'in_progress',
              });

              if (updatedEnquiry) {
                sendPaymentReceiptToCustomer(updatedEnquiry, {
                  ...payment,
                  razorpayPaymentId,
                  method,
                  status: 'captured',
                }).catch((e: unknown) => console.error('[Webhook Receipt Email Error]:', e));
              }
            }
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event?.payload?.payment?.entity;
      if (paymentEntity?.order_id) {
        const payment = await getPaymentByRazorpayOrderId(paymentEntity.order_id);
        if (payment) {
          await updatePayment(payment.id, {
            status: 'failed',
            razorpayPaymentId: paymentEntity.id,
            errorMessage: paymentEntity.error_description || 'Payment failed on Razorpay',
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('[Razorpay Webhook Handler Exception]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
