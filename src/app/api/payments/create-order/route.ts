import { NextRequest, NextResponse } from 'next/server';
import { 
  getEnquiryById, 
  getOrdersByEnquiryId, 
  createOrder, 
  createPayment 
} from '@/server/db/repository';
import { createRazorpayOrder, getPayableAmountForEnquiry } from '@/server/payments';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enquiryId, token } = body;

    if (!enquiryId) {
      return NextResponse.json({ error: 'Missing enquiryId parameter' }, { status: 400 });
    }

    const enquiry = await getEnquiryById(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    // Verify token or admin
    const adminCookie = req.cookies.get('netrawebai_admin_session')?.value;
    const isAdmin = adminCookie === 'authenticated_owner_session' || adminCookie === (process.env.ADMIN_PASSWORD || 'admin_netrawebai_2026');
    if (!isAdmin && enquiry.accessToken !== token) {
      return NextResponse.json({ error: 'Unauthorized. Invalid customer access token.' }, { status: 403 });
    }

    // If enquiry is already paid, prevent duplicate payment order creation
    if (enquiry.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'This website order has already been paid for. Duplicate payment prevented.' },
        { status: 400 }
      );
    }

    // For custom websites, quote must be provided and accepted before payment
    if (enquiry.packageType === 'custom') {
      if (enquiry.status !== 'quote_accepted' && enquiry.status !== 'quoted') {
        return NextResponse.json(
          { error: 'A custom website quote must be reviewed and accepted before proceeding to checkout.' },
          { status: 400 }
        );
      }
    }

    // Determine trusted price strictly from server models
    const amount = getPayableAmountForEnquiry(enquiry);
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'A valid price has not yet been set for this project. Please contact the team.' },
        { status: 400 }
      );
    }

    // Look for existing created order or create new order record
    const existingOrders = await getOrdersByEnquiryId(enquiry.id);
    let order = existingOrders.find((o) => o.status === 'created');

    if (!order) {
      order = await createOrder({
        enquiryId: enquiry.id,
        orderType: enquiry.packageType === 'custom' ? 'approved_quote' : 'fixed_package',
        packageType: enquiry.packageType,
        description: `Website design & hosting for ${enquiry.businessName} (${enquiry.enquiryNumber})`,
        amount,
      });
    }

    // Generate Razorpay Order
    const rzpResult = await createRazorpayOrder(enquiry, order);

    // Record payment intent in DB
    await createPayment({
      enquiryId: enquiry.id,
      orderId: order.id,
      razorpayOrderId: rzpResult.razorpayOrderId,
      amount: rzpResult.amount,
      currency: rzpResult.currency,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: rzpResult.razorpayOrderId,
      amount: rzpResult.amount,
      amountInPaise: rzpResult.amountInPaise,
      currency: rzpResult.currency,
      keyId: rzpResult.keyId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      enquiryNumber: enquiry.enquiryNumber,
      customerName: enquiry.customerName,
      businessName: enquiry.businessName,
      email: enquiry.email,
      phone: enquiry.phone,
      simulated: rzpResult.simulated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create payment order';
    console.error('[Create Payment Order Error]:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
