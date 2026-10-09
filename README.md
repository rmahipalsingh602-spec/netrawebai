# Netrawebai (नेत्रवेब एआई) — Har Dukaan Online

> **"Your Shop. Your Style. Your Website."**  
> A premium, mobile-first platform helping every local business owner in India launch an affordable, beautiful website and connect with walk-in and online customers.

---

## 🌟 Overview

**Netrawebai** provides a full end-to-end customer order, enquiry, WhatsApp communication, Resend email delivery, quote preparation, and Razorpay payment integration workflow specifically tailored for Indian local retailers:
- Mobile Shops & Accessories
- Mobile Repair Clinics & Diagnostics
- Clothing Boutiques & Ethnic Wear
- Cafés, Chai Spots & Bakeries
- Fine Jewellery Showrooms
- Kirana & Neighbourhood Grocery Stores

---

## 🚀 Key Modules & Workflow

### 1. Website Enquiry & Order Request Form (`/order`)
- Collects:
  - Customer full name and contact number (calling + WhatsApp)
  - Shop or business name
  - Verified email address
  - Business category (20 Indian retail trades)
  - Preferred visual design template & brand color palette
  - Interactive pages and features needed (multi-select)
  - Products or services to display (catalog preview)
  - Custom domain requirements (`.in`, `.com` or instant `yourname.netrawebai.in`)
  - Target completion timeline (24-48h express vs. standard)
  - Competitor or reference links and special requests
- **Spam Protection**: Silent honeypot trap (`website_url_hp`) and IP rate-limiting.
- **Privacy Consent**: Mandatory legal compliance consent before submission.
- **Client & Server Validation**: Strict regex email checking and 10-digit Indian mobile validation.
- **Submission States**: Animated loading state, clear validation banners, and a celebratory confirmation card displaying the unique **Enquiry Tracking Number** (e.g. `NW-2026-4917`).

### 2. Two Distinct Order Paths & Trusted Server Pricing
- **Path A: Fixed-Price Package**:
  - `Smart Dukaan`: ₹1,499 one-time (5 pages, catalog, WhatsApp basket, 1-yr cloud hosting).
  - `Royal Brand`: ₹2,999 one-time (unlimited catalog, custom `.in` domain, priority support).
  - Pre-approved server pricing; customer can proceed directly to checkout.
- **Path B: Custom Website**:
  - Requirements submitted for engineering review.
  - Starts in `pending` / `reviewing` status.
  - Business owner prepares quote (amount, deliverables, exclusions, terms).
  - Customer reviews quote at `/quote/[id]?token=...` and must click **Accept Quote** before payment order creation is permitted.
  - **Tamper-Proof Guarantee**: The client browser can never dictate or tamper with the payable amount.

### 3. Server-Side Persistent Storage (`.data/db.json`)
- Safe server-side persistent database repository with:
  - Unique enquiry ID (`enq_...`) & human-readable enquiry number (`NW-2026-XXXX`).
  - Cryptographic 48-hex access token (`accessToken`) for secure customer authorization.
  - Full project requirements, catalog items, timestamps, status history.
  - Order records (`ORD-2026-XXXX`) and Payment records (`pay_...`).
  - Webhook delivery audit logs (`wh_...`).
  - Atomic writes (`.tmp` file swapping) and concurrency mutex locks to prevent race conditions.
  - Pre-seeded with realistic demonstration enquiries for testing.

### 4. Direct WhatsApp Communication (`wa.me`)
- Prominent **"Discuss on WhatsApp"** button.
- Generates fully compliant, URL-encoded `https://wa.me/91XXXXXXXXXX?text=...` links.
- Pre-fills a concise enquiry summary with shop name, plan, and enquiry tracking number.
- Opens WhatsApp Web or mobile app directly without requiring WhatsApp Cloud API credentials for basic customer-to-owner chat.

### 5. Resend Email Notifications (`src/server/email.ts`)
- Server-side integration with the official Resend SDK.
- **Owner Notification**: Dispatched immediately when an enquiry is recorded.
- **Customer Acknowledgement**: Dispatched with project summary, tracking number, and direct quote link.
- **Quote Ready Alert**: Sent when the business owner prepares or revises an official quote.
- **Payment Receipt**: Sent with Razorpay Payment ID and order confirmation upon successful verification.
- **Resilient Fallback**: If `RESEND_API_KEY` is unconfigured, system logs a clean simulation message without failing or rolling back the saved enquiry.

### 6. Razorpay Payment Gateway (`src/server/payments.ts`)
- **Server-Side Order Creation** (`/api/payments/create-order`):
  - Fetches trusted amount from database models.
  - Generates Razorpay Order (`order_...`).
- **Secure Verification** (`/api/payments/verify`):
  - Timing-safe constant-time HMAC-SHA256 signature verification (`crypto.timingSafeEqual`).
  - Idempotent update: updates payment record to `captured`, order to `paid`, and enquiry to `in_progress`.
- **Idempotent Webhooks** (`/api/payments/webhook`):
  - Listens for `payment.captured` and `payment.failed`.
  - Verifies `x-razorpay-signature` against `RAZORPAY_WEBHOOK_SECRET`.
  - Dedupes events using `isWebhookProcessed(eventId)`.
- **Test Mode & Sandbox Simulation**: Supports test credentials (`rzp_test_...`) and includes an in-browser simulated payment flow for sandbox testing.

### 7. Owner Administration Portal (`/admin` & `/admin/enquiries`)
- Protected by real password authentication (`ADMIN_PASSWORD`) with HTTP-only cookie session.
- **Overview Metrics**: Total enquiries, Pending review, Quoted, Paid orders, Total revenue collected.
- **Management Capabilities**:
  - Filter and search customer requests.
  - Review complete requirements, catalog text, domain requests.
  - Directly open WhatsApp with customer (`wa.me`).
  - Preview category storefront blueprint.
  - Prepare and revise official quotes (quoted amount, deliverables, exclusions, terms).
  - Toggle email quote notifications.
  - Inspect Razorpay Payment ID, order ID, and transaction timestamps.

---

## ⚙️ Environment Variables

Create `.env.local` or `.env` in the project root:

```bash
# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# WhatsApp Public Number (Format: Country code + 10 digits without + or -)
NEXT_PUBLIC_WHATSAPP_NUMBER=919829012345

# Database Configuration (File-backed persistent storage)
DATABASE_URL=file:.data/db.json

# Resend Email Integration (https://resend.com)
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=owner@netrawebai.in
RESEND_FROM_EMAIL=Netrawebai <onboarding@resend.dev>

# Razorpay Checkout (https://razorpay.com)
RAZORPAY_KEY_ID=rzp_test_netrawebai123
RAZORPAY_KEY_SECRET=rzp_test_secret_netrawebai456
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_789

# Owner Dashboard Authentication
ADMIN_PASSWORD=admin_netrawebai_2026
```

> **Note**: Default placeholder test keys are configured so the entire workflow works out of the box in test simulation mode.

---

## 🧪 Testing & Verification

Run the comprehensive end-to-end automated test suite:

```bash
npx tsx scripts/test-workflow.mjs
```

### Verified Test Suite Results (27/27 PASSING):
1. **Enquiry Creation**: Valid `enq_` ID, `NW-2026-XXXX` reference, and 48-char access token.
2. **Database Persistence**: File-backed storage in `.data/db.json` with mutex atomic writes.
3. **Customer Access Control**: Authorized retrieval with valid token; rejection of forged tokens.
4. **WhatsApp URL Encoding**: Compliant `https://wa.me/` link generation with encoded parameters.
5. **Resend Email Delivery**: Graceful simulation and error handling without database loss.
6. **Custom Quote Flow**: Pending -> Owner Quoted -> Customer Accepted.
7. **Tamper-Proof Pricing**: Server-side price resolution; client cannot inject arbitrary amounts.
8. **HMAC Signature Check**: Valid Razorpay signature passes; tampered signature rejected.
9. **Webhook Idempotency**: Signature verified and duplicate event delivery deduped.

### Production Build & Type Checking

```bash
# TypeScript compiler check
npx tsc --noEmit

# Production build and static page generation (55 routes)
npm run build
```

---

## 🔒 Safe Transition from Test Mode to Live Mode

When ready to accept live payments from real shop owners:

1. **Razorpay Dashboard**:
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com) &rarr; Settings &rarr; API Keys.
   - Switch from **Test Mode** to **Live Mode**.
   - Generate Live `Key ID` and `Key Secret`.
   - In `.env.local`, set `RAZORPAY_KEY_ID=rzp_live_...` and `RAZORPAY_KEY_SECRET=...`.
2. **Razorpay Webhooks**:
   - Navigate to Settings &rarr; Webhooks &rarr; Add New Webhook.
   - Webhook URL: `https://your-domain.com/api/payments/webhook`.
   - Secret: Enter your `RAZORPAY_WEBHOOK_SECRET`.
   - Active Events: Select `payment.captured` and `payment.failed`.
3. **Resend Domain Verification**:
   - Add your custom domain (e.g. `netrawebai.in`) to [Resend Domains](https://resend.com/domains).
   - Configure DNS records (SPF, DKIM, DMARC).
   - Set `RESEND_FROM_EMAIL=Netrawebai <orders@netrawebai.in>`.
4. **Admin Security**:
   - Change `ADMIN_PASSWORD` in production environment variables to a high-entropy passphrase.

---

## 📄 License & Credits

Developed with pride in Rajasthan for India's retail merchants.  
&copy; 2026 Netrawebai Technologies. All rights reserved.
