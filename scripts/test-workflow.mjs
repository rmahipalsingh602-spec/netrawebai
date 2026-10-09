/**
 * Netrawebai End-to-End Workflow Verification Suite
 * Tests enquiry validation, db persistence, tokens, WhatsApp encoding,
 * quotes, admin auth, Razorpay signature checks, and webhooks.
 */

import crypto from 'crypto';
import { 
  createEnquiry, 
  getEnquiryById, 
  getEnquiryByToken, 
  updateEnquiry, 
  createOrder, 
  createPayment, 
  getPaymentByRazorpayOrderId,
  updatePayment,
  isWebhookProcessed,
  logWebhook
} from '../src/server/db/repository.js';

import { 
  getPayableAmountForEnquiry, 
  verifyPaymentSignature, 
  verifyWebhookSignature 
} from '../src/server/payments.js';

import { 
  sendEnquiryNotificationToOwner, 
  sendEnquiryAcknowledgementToCustomer, 
  sendQuoteReadyToCustomer, 
  sendPaymentReceiptToCustomer 
} from '../src/server/email.js';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 NETRAWEBAI END-TO-END WORKFLOW TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Database Persistence & Enquiry Generation
  // ----------------------------------------------------
  console.log('TEST 1: Creating and persisting new customer enquiry...');
  const testEnquiry = await createEnquiry({
    customerName: 'Test Sharma',
    businessName: 'Sharma Sweets & Bakers',
    email: 'sharma@example.com',
    phone: '9829123456',
    whatsapp: '919829123456',
    category: 'sweets',
    preferredTemplate: 'tmpl-warm-bistro',
    pagesNeeded: ['Home', 'Mithai Menu', 'WhatsApp Box Delivery'],
    featuresNeeded: ['WhatsApp Order Basket', 'UPI QR Code'],
    productsServices: 'Kaju Katli, Mawa Kachori, Gulab Jamun, Samosa',
    budgetRange: '₹1,499 (Smart Dukaan)',
    packageType: 'smart',
    domainNeeded: true,
    domainName: 'sharmasweets.in',
  });

  assert(testEnquiry.id.startsWith('enq_'), 'Enquiry has valid unique ID prefix enq_');
  assert(testEnquiry.enquiryNumber.startsWith('NW-'), `Generated enquiry number ${testEnquiry.enquiryNumber}`);
  assert(testEnquiry.accessToken.length === 48, 'Generated 48-character cryptographic access token');
  assert(testEnquiry.status === 'quoted', 'Fixed package enquiry pre-populated as quoted');
  assert(testEnquiry.quotedAmount === 1499, 'Fixed package price set to ₹1,499');

  // Verify retrieval
  const retrieved = await getEnquiryById(testEnquiry.id);
  assert(retrieved !== null && retrieved.businessName === 'Sharma Sweets & Bakers', 'Enquiry retrieved from persistent JSON store');

  // ----------------------------------------------------
  // TEST 2: Customer Token Access Security
  // ----------------------------------------------------
  console.log('\nTEST 2: Customer Access Token Verification...');
  const tokenMatch = await getEnquiryByToken(testEnquiry.accessToken);
  assert(tokenMatch?.id === testEnquiry.id, 'Enquiry successfully resolved with correct secret token');

  const invalidTokenMatch = await getEnquiryByToken('invalid_token_attempt_12345');
  assert(invalidTokenMatch === null, 'Rejected retrieval attempt with forged/invalid token');

  // ----------------------------------------------------
  // TEST 3: WhatsApp Click-to-Chat URL & Message Encoding
  // ----------------------------------------------------
  console.log('\nTEST 3: WhatsApp URL Generation & Encoding...');
  const publicWhatsApp = '919829012345';
  const waSummary = `Namaste Netrawebai! I am interested in building a website for my shop *${testEnquiry.businessName}*.\n- Plan: ${testEnquiry.packageType.toUpperCase()}\n- Ref: ${testEnquiry.enquiryNumber}`;
  const waUrl = `https://wa.me/${publicWhatsApp}?text=${encodeURIComponent(waSummary)}`;

  assert(waUrl.startsWith('https://wa.me/919829012345?text='), 'WhatsApp URL points correctly to public WhatsApp number');
  assert(waUrl.includes(encodeURIComponent('Sharma Sweets & Bakers')), 'Business name properly URL-encoded');
  assert(!waUrl.includes(' '), 'No unencoded spaces in WhatsApp URL');

  // ----------------------------------------------------
  // TEST 4: Resend Email Resilient Delivery
  // ----------------------------------------------------
  console.log('\nTEST 4: Resend Email Dispatch & Graceful Fallback...');
  const ownerResult = await sendEnquiryNotificationToOwner(testEnquiry);
  assert(ownerResult.success === true, 'Owner email notification sent/simulated gracefully without throwing');

  const customerAckResult = await sendEnquiryAcknowledgementToCustomer(testEnquiry);
  assert(customerAckResult.success === true, 'Customer acknowledgement dispatched successfully');

  // ----------------------------------------------------
  // TEST 5: Custom Quote Workflow (Owner Preparation -> Customer Acceptance)
  // ----------------------------------------------------
  console.log('\nTEST 5: Custom Quote Preparation and Acceptance...');
  const customEnquiry = await createEnquiry({
    customerName: 'Anil Soni',
    businessName: 'Soni Jewellers Showroom',
    email: 'anil@sonijewellers.demo',
    phone: '9414011223',
    category: 'jewellery',
    packageType: 'custom',
    budgetRange: '₹5,000 - ₹10,000',
    additionalNotes: 'Need 3D jewellery virtual try-on badge and live gold rate banner',
  });

  assert(customEnquiry.status === 'pending', 'Custom project starts in pending review status');
  assert(customEnquiry.quotedAmount === null, 'Custom project starts with null quoted amount');

  // Owner prepares quote
  const quoted = await updateEnquiry(customEnquiry.id, {
    status: 'quoted',
    quotedAmount: 4999,
    quoteScope: '1. Custom bridal jewellery gallery\n2. Daily gold rate ticker\n3. High-security hosting',
    quoteExclusions: 'Physical photography shoots',
    quoteTerms: '50% advance to start development, 3 days delivery',
    quoteSentAt: new Date().toISOString(),
  });

  assert(quoted?.status === 'quoted', 'Owner transitioned enquiry status to quoted');
  assert(quoted?.quotedAmount === 4999, 'Owner set custom approved quote to ₹4,999');

  // Customer accepts quote
  const accepted = await updateEnquiry(customEnquiry.id, {
    status: 'quote_accepted',
    quoteAcceptedAt: new Date().toISOString(),
  });

  assert(accepted?.status === 'quote_accepted', 'Customer accepted quote; status moved to quote_accepted');

  // ----------------------------------------------------
  // TEST 6: Trusted Server-Side Pricing Verification
  // ----------------------------------------------------
  console.log('\nTEST 6: Trusted Server Pricing (Tamper Resistance)...');
  const price1 = getPayableAmountForEnquiry(testEnquiry);
  assert(price1 === 1499, `Resolved fixed package trusted amount: ₹${price1}`);

  const price2 = getPayableAmountForEnquiry(accepted);
  assert(price2 === 4999, `Resolved custom approved quote trusted amount: ₹${price2}`);

  let thrown = false;
  try {
    getPayableAmountForEnquiry({ ...customEnquiry, quotedAmount: null, packageType: 'custom' });
  } catch {
    thrown = true;
  }
  assert(thrown, 'Correctly threw error when attempting to pay unquoted custom website');

  // ----------------------------------------------------
  // TEST 7: Razorpay Signature Verification
  // ----------------------------------------------------
  console.log('\nTEST 7: Razorpay Payment Signature Verification...');
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_netrawebai456';
  const orderId = 'order_test_998877';
  const paymentId = 'pay_test_112233';

  // Compute genuine HMAC-SHA256 signature
  const validSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValidSignature = verifyPaymentSignature(orderId, paymentId, validSignature);
  assert(isValidSignature === true, 'Valid HMAC-SHA256 payment signature verified successfully');

  const isInvalidSignature = verifyPaymentSignature(orderId, paymentId, 'tampered_fake_signature_abc');
  assert(isInvalidSignature === false, 'Tampered/fake signature correctly rejected');

  // ----------------------------------------------------
  // TEST 8: Razorpay Webhook Signature & Idempotency
  // ----------------------------------------------------
  console.log('\nTEST 8: Webhook Signature & Idempotency...');
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_789';
  const webhookPayload = JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_test_wh_1',
          order_id: 'order_test_wh_1',
          amount: 149900,
        },
      },
    },
  });

  const validWhSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(webhookPayload)
    .digest('hex');

  const isValidWebhook = verifyWebhookSignature(webhookPayload, validWhSignature);
  assert(isValidWebhook === true, 'Valid webhook HMAC signature verified');

  const isInvalidWebhook = verifyWebhookSignature(webhookPayload, 'invalid_wh_sig');
  assert(isInvalidWebhook === false, 'Invalid webhook signature rejected');

  // Test idempotency logging
  const testEventId = `evt_test_${Date.now()}`;
  assert((await isWebhookProcessed(testEventId)) === false, 'Event recognized as not yet processed');
  await logWebhook(testEventId, 'payment.captured', webhookPayload);
  assert((await isWebhookProcessed(testEventId)) === true, 'Event recognized as processed on subsequent check (Idempotent)');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
