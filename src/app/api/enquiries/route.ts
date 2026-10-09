import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry, getAllEnquiries } from '@/server/db/repository';
import { sendEnquiryNotificationToOwner, sendEnquiryAcknowledgementToCustomer } from '@/server/email';
import { PackageType } from '@/server/db/types';

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 }); // 1 minute window
    return false;
  }
  if (entry.count >= 10) {
    return true;
  }
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'local';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Spam protection honeypot
    if (body.website_url_hp || body.hp_field) {
      // Honeypot field filled by bot, silently reject
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    // 2. Validate Privacy Policy Consent
    if (!body.consentPrivacy) {
      return NextResponse.json(
        { error: 'Please accept the privacy policy to proceed with your website request.' },
        { status: 400 }
      );
    }

    // 3. Validate Required Fields
    const customerName = String(body.customerName || '').trim();
    const businessName = String(body.businessName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim().replace(/[^0-9+]/g, '');
    const category = String(body.category || '').trim();

    if (!customerName || customerName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid customer name (minimum 2 characters).' }, { status: 400 });
    }
    if (!businessName || businessName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid business/shop name.' }, { status: 400 });
    }

    // Email format validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // Indian phone number digits check
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Please select a business category for your shop.' }, { status: 400 });
    }

    // 4. Sanitize and structure requirements
    const whatsapp = body.whatsapp ? String(body.whatsapp).trim().replace(/[^0-9]/g, '') : cleanDigits;
    const pagesNeeded = Array.isArray(body.pagesNeeded) ? body.pagesNeeded.map(String) : [];
    const featuresNeeded = Array.isArray(body.featuresNeeded) ? body.featuresNeeded.map(String) : [];
    const packageType: PackageType = ['starter', 'smart', 'royal', 'custom'].includes(body.packageType) 
      ? body.packageType 
      : 'custom';

    // 5. Store Enquiry in Persistent Database
    const enquiry = await createEnquiry({
      customerName,
      businessName,
      email,
      phone,
      whatsapp: whatsapp.length >= 10 ? (whatsapp.startsWith('91') ? whatsapp : `91${whatsapp.slice(-10)}`) : cleanDigits,
      category,
      preferredTemplate: body.preferredTemplate ? String(body.preferredTemplate).trim() : undefined,
      pagesNeeded,
      featuresNeeded,
      productsServices: body.productsServices ? String(body.productsServices).trim().slice(0, 2000) : undefined,
      preferredColors: body.preferredColors ? String(body.preferredColors).trim().slice(0, 200) : undefined,
      domainNeeded: Boolean(body.domainNeeded),
      domainName: body.domainName ? String(body.domainName).trim().slice(0, 100) : undefined,
      budgetRange: body.budgetRange ? String(body.budgetRange).trim() : undefined,
      targetDate: body.targetDate ? String(body.targetDate).trim() : undefined,
      referenceLinks: body.referenceLinks ? String(body.referenceLinks).trim().slice(0, 500) : undefined,
      additionalNotes: body.additionalNotes ? String(body.additionalNotes).trim().slice(0, 3000) : undefined,
      packageType,
    });

    // 6. Asynchronously trigger resilient email notifications
    // Note: If email delivery fails, the enquiry remains safely stored.
    Promise.allSettled([
      sendEnquiryNotificationToOwner(enquiry),
      sendEnquiryAcknowledgementToCustomer(enquiry),
    ]).catch((err) => console.error('[Background Email Notification Error]:', err));

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      enquiryNumber: enquiry.enquiryNumber,
      accessToken: enquiry.accessToken,
      status: enquiry.status,
      quotedAmount: enquiry.quotedAmount,
      quoteUrl: `/quote/${enquiry.id}?token=${enquiry.accessToken}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[Create Enquiry API Exception]:', message);
    return NextResponse.json(
      { error: 'Failed to save enquiry. Please check your details and try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Only authenticated admins are allowed to read all enquiries
  const authHeader = req.headers.get('authorization') || '';
  const adminCookie = req.cookies.get('netrawebai_admin_session')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_netrawebai_2026';

  const isAuthenticated = 
    authHeader === `Bearer ${adminPassword}` ||
    adminCookie === adminPassword ||
    adminCookie === 'authenticated_owner_session';

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin authorization required to view enquiries list.' },
      { status: 401 }
    );
  }

  const enquiries = await getAllEnquiries();
  return NextResponse.json({ enquiries });
}
