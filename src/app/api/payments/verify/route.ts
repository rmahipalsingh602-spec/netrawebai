import { NextRequest, NextResponse } from 'next/server';
import { 
  getPaymentByRazorpayOrderId, 
  updatePayment, 
  getOrderById, 
  updateOrder, 
  getEnquiryById, 
  updateEnquiry 
} from '@/server/db/repository';
import { verifyPaymentSignature } from '@/server/payments';
import { sendPaymentReceiptToCustomer } from '@/server/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      enquiryId 
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Strict Server-Side HMAC-SHA256 Signature Verification
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.warn(`[Payment Verification Failed]: Invalid signature for order ${razorpay_order_id}`);
      // Mark payment as failed if record exists
      const paymentRecord = await getPaymentByRazorpayOrderId(razorpay_order_id);
      if (paymentRecord) {
        await updatePayment(paymentRecord.id, {
          status: 'failed',
          razorpayPaymentId: razorpay_payment_id,
          errorMessage: 'HMAC signature verification failed',
        });
      }

      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed on the server.' },
        { status: 400 }
      );
    }

    // 2. Fetch and Idempotently Process Payment Record
    const payment = await getPaymentByRazorpayOrderId(razorpay_order_id);
    
    // Determine target enquiry
    const targetEnquiryId = enquiryId || (payment ? payment.enquiryId : null);
    if (!targetEnquiryId) {
      return NextResponse.json(
        { error: 'Associated website enquiry could not be found for this payment.' },
        { status: 404 }
      );
    }

    const enquiry = await getEnquiryById(targetEnquiryId);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry record not found.' }, { status: 404 });
    }

    // Check if already processed (Idempotency)
    if (enquiry.paymentStatus === 'paid' && payment && payment.status === 'captured') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified and confirmed.',
        enquiryNumber: enquiry.enquiryNumber,
        paymentId: payment.razorpayPaymentId || razorpay_payment_id,
        status: 'paid',
      });
    }

    const now = new Date().toISOString();

    // 3. Update Payment record
    if (payment) {
      await updatePayment(payment.id, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'captured',
        updatedAt: now,
      });

      // Update Order record
      if (payment.orderId) {
        await updateOrder(payment.orderId, {
          status: 'paid',
          updatedAt: now,
        });
      }
    }

    // 4. Update Enquiry record
    const updatedEnquiry = await updateEnquiry(enquiry.id, {
      paymentStatus: 'paid',
      paidAmount: payment ? payment.amount : (enquiry.quotedAmount || 1499),
      paidAt: now,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: 'in_progress', // Move to website building stage
    });

    // 5. Asynchronously send payment receipt to customer and alert owner
    if (updatedEnquiry && payment) {
      sendPaymentReceiptToCustomer(updatedEnquiry, {
        ...payment,
        razorpayPaymentId: razorpay_payment_id,
        status: 'captured',
      }).catch((e: unknown) => console.error('[Payment Receipt Email Error]:', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and recorded successfully!',
      enquiryNumber: enquiry.enquiryNumber,
      orderId: payment?.orderId || null,
      paymentId: razorpay_payment_id,
      status: 'paid',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment verification server error';
    console.error('[Payment Verification Exception]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
