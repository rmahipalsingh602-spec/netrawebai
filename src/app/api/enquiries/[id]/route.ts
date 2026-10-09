import { NextRequest, NextResponse } from 'next/server';
import { 
  getEnquiryById, 
  updateEnquiry, 
  getOrdersByEnquiryId, 
  getPaymentsByEnquiryId,
  createOrder 
} from '@/server/db/repository';
import { sendQuoteReadyToCustomer } from '@/server/email';
import { EnquiryStatus } from '@/server/db/types';

function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const adminCookie = req.cookies.get('netrawebai_admin_session')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_netrawebai_2026';

  return (
    authHeader === `Bearer ${adminPassword}` ||
    adminCookie === adminPassword ||
    adminCookie === 'authenticated_owner_session'
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiry = await getEnquiryById(id);

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    const isAdmin = checkAdminAuth(req);
    const token = req.nextUrl.searchParams.get('token') || req.headers.get('x-enquiry-token');

    // Verify customer token if not admin
    if (!isAdmin) {
      if (!token || token !== enquiry.accessToken) {
        return NextResponse.json(
          { error: 'Unauthorized. Valid access token required to view this enquiry.' },
          { status: 403 }
        );
      }
    }

    const orders = await getOrdersByEnquiryId(enquiry.id);
    const payments = await getPaymentsByEnquiryId(enquiry.id);

    return NextResponse.json({
      enquiry,
      orders,
      payments,
      isAdmin,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiry = await getEnquiryById(id);

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    const isAdmin = checkAdminAuth(req);
    const body = await req.json();
    const token = body.token || req.nextUrl.searchParams.get('token') || req.headers.get('x-enquiry-token');

    // Case 1: Customer accepting quote
    if (body.action === 'accept_quote') {
      if (!token || token !== enquiry.accessToken) {
        return NextResponse.json(
          { error: 'Unauthorized. Invalid customer access token.' },
          { status: 403 }
        );
      }

      if (enquiry.status !== 'quoted' && enquiry.status !== 'pending') {
        return NextResponse.json(
          { error: `Quote cannot be accepted from current status: ${enquiry.status}` },
          { status: 400 }
        );
      }

      const payableAmount = enquiry.quotedAmount || 1499;

      // Create an order record for this accepted quote
      const order = await createOrder({
        enquiryId: enquiry.id,
        orderType: enquiry.packageType === 'custom' ? 'approved_quote' : 'fixed_package',
        packageType: enquiry.packageType,
        description: `Approved website order for ${enquiry.businessName}`,
        amount: payableAmount,
      });

      const updated = await updateEnquiry(enquiry.id, {
        status: 'quote_accepted',
        quoteAcceptedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Quote accepted successfully! You can now proceed to payment.',
        enquiry: updated,
        order,
      });
    }

    // Case 2: Owner / Admin editing quote or changing status
    if (isAdmin) {
      const allowedStatus: EnquiryStatus[] = [
        'pending',
        'in_review',
        'quoted',
        'quote_accepted',
        'in_progress',
        'completed',
        'cancelled',
      ];

      const updates: Record<string, unknown> = {};

      if (body.status && allowedStatus.includes(body.status)) {
        updates.status = body.status;
      }

      if (body.quotedAmount !== undefined) {
        const num = Number(body.quotedAmount);
        if (!isNaN(num) && num >= 0) {
          updates.quotedAmount = num;
          // If a quote was set, transition to 'quoted' status unless already accepted/paid
          if (enquiry.status === 'pending' || enquiry.status === 'in_review') {
            updates.status = 'quoted';
          }
          updates.quoteSentAt = new Date().toISOString();
        }
      }

      if (body.quoteScope !== undefined) updates.quoteScope = String(body.quoteScope);
      if (body.quoteExclusions !== undefined) updates.quoteExclusions = String(body.quoteExclusions);
      if (body.quoteTerms !== undefined) updates.quoteTerms = String(body.quoteTerms);
      if (body.paymentStatus !== undefined) updates.paymentStatus = body.paymentStatus;
      if (body.notes !== undefined) updates.additionalNotes = String(body.notes);

      const updated = await updateEnquiry(enquiry.id, updates);

      // If quote was provided or updated, send quote ready email notification
      if (body.notifyCustomer && updated && updated.quotedAmount) {
        sendQuoteReadyToCustomer(updated).catch((e: unknown) =>
          console.error('[Quote Notification Error]:', e)
        );
      }

      return NextResponse.json({
        success: true,
        enquiry: updated,
      });
    }

    return NextResponse.json(
      { error: 'Unauthorized. Owner credentials required for this action.' },
      { status: 403 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
