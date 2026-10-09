import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Enquiry, Order, Payment, WebhookLog, PackageType, EnquiryStatus, PaymentStatus } from './types';
import { FIXED_PACKAGES } from '../packages';

const DATA_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.join('/tmp', '.data')
  : path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  enquiries: Enquiry[];
  orders: Order[];
  payments: Payment[];
  webhookLogs: WebhookLog[];
}

// In-memory fallback for serverless safety
let inMemoryDb: DatabaseSchema | null = null;

// In-memory mutex for safe atomic writes
let isWriting = false;
const writeQueue: Array<() => void> = [];

async function acquireLock(): Promise<void> {
  if (!isWriting) {
    isWriting = true;
    return;
  }
  return new Promise((resolve) => {
    writeQueue.push(() => {
      isWriting = true;
      resolve();
    });
  });
}

function releaseLock(): void {
  if (writeQueue.length > 0) {
    const next = writeQueue.shift();
    next?.();
  } else {
    isWriting = false;
  }
}

function generateEnquiryNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NW-${new Date().getFullYear()}-${randomSuffix}`;
}

function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${new Date().getFullYear()}-${randomSuffix}`;
}

function generateSecureToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

function getInitialSeed(): DatabaseSchema {
  return {
    enquiries: [
      {
        id: 'enq_seed_mahadev',
        enquiryNumber: 'NW-2026-1001',
        accessToken: 'token_mahadev_demo_seed_849204',
        customerName: 'Prakash Gehlot',
        email: 'prakash@mahadevmobile.demo',
        phone: '9829012345',
        whatsapp: '919829012345',
        businessName: 'Mahadev Mobile',
        category: 'mobile-shops',
        preferredTemplate: 'tmpl-dark-premium',
        pagesNeeded: ['Home', 'Smartphones', 'Accessories', 'Repair Support', 'Contact & Map'],
        featuresNeeded: ['5G Model Filter', 'WhatsApp Ordering', 'Brand Warranties', 'EMI Calculator'],
        productsServices: 'Samsung Galaxy S24 Ultra, iPhone 16 Pro, Fast Chargers, Earbuds',
        preferredColors: 'Obsidian Navy & Electric Blue',
        domainNeeded: true,
        domainName: 'mahadevmobile.in',
        budgetRange: ' ₹100 - ₹1,499 - ₹2,999',
        targetDate: 'Within 3 days',
        referenceLinks: 'https://mahadevmobile.demo',
        additionalNotes: 'Need 0% EMI badge and brand warranty tags on all products.',
        status: 'quoted',
        packageType: 'smart',
        quotedAmount: 1499,
        quoteScope: '1. Complete mobile storefront design with Samsung/Apple brand filters\n2. 5G specification sheets\n3. Hosting on mahadevmobile.netrawebai.in\n4. WhatsApp direct ordering button',
        quoteExclusions: 'Paid Google Search Ads',
        quoteTerms: '100% advance for hosting provisioning. 2 days turnaround.',
        quoteSentAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        paymentStatus: 'unpaid',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'enq_seed_lakhmi',
        enquiryNumber: 'NW-2026-1002',
        accessToken: 'token_lakhmi_demo_seed_192837',
        customerName: 'Suresh Choudhary',
        email: 'suresh@lakhmikirana.demo',
        phone: '9414177665',
        whatsapp: '919414177665',
        businessName: 'Lakhmi Kirana Shop',
        category: 'kirana',
        preferredTemplate: 'tmpl-clean-simple',
        pagesNeeded: ['Home', 'Daily Ration', 'Oils & Ghee', 'Dry Fruits', 'Delivery Map'],
        featuresNeeded: ['WhatsApp Grocery Basket Builder', 'Free Delivery above ₹499', 'Wholesale Rate Tag'],
        productsServices: 'Pure Desi Cow Ghee, Sharbati Chakki Atta, Mathania Red Chilli, Basmati Rice',
        preferredColors: 'Emerald Botanical Green & Cream',
        domainNeeded: false,
        budgetRange: '₹1,499',
        targetDate: 'Immediate',
        additionalNotes: 'Our customers want to click products and send their complete grocery list in one WhatsApp message.',
        status: 'quote_accepted',
        packageType: 'smart',
        quotedAmount: 1499,
        quoteScope: 'Interactive WhatsApp grocery basket calculator with 1-year hosting',
        quoteSentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        quoteAcceptedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        paymentStatus: 'unpaid',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'enq_seed_royal',
        enquiryNumber: 'NW-2026-1003',
        accessToken: 'token_royal_demo_seed_472819',
        customerName: 'Vikram Solanki',
        email: 'vikram@royalrepair.demo',
        phone: '9414088990',
        whatsapp: '919414088990',
        businessName: 'Royal Mobile Repair',
        category: 'mobile-repair',
        preferredTemplate: 'tmpl-pro-service',
        pagesNeeded: ['Home', 'Repair Diagnostics', 'Price Estimator', 'Contact'],
        featuresNeeded: ['Interactive Repair Estimator', '30-Min Screen Replacement Badge', '90-Day Warranty'],
        status: 'in_progress',
        packageType: 'smart',
        quotedAmount: 1499,
        quoteScope: 'Instant quote estimator form with WhatsApp quote dispatch',
        quoteSentAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        quoteAcceptedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        paymentStatus: 'paid',
        paidAmount: 1499,
        paidAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        razorpayPaymentId: 'pay_test_seed_772819',
        razorpayOrderId: 'order_test_seed_99182',
        domainNeeded: false,
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ],
    orders: [
      {
        id: 'ord_seed_1',
        orderNumber: 'ORD-2026-1001',
        enquiryId: 'enq_seed_royal',
        orderType: 'fixed_package',
        packageType: 'smart',
        description: 'Smart Dukaan Package for Royal Mobile Repair',
        amount: 1499,
        currency: 'INR',
        status: 'paid',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ],
    payments: [
      {
        id: 'pay_seed_1',
        enquiryId: 'enq_seed_royal',
        orderId: 'ord_seed_1',
        razorpayOrderId: 'order_test_seed_99182',
        razorpayPaymentId: 'pay_test_seed_772819',
        amount: 1499,
        currency: 'INR',
        status: 'captured',
        method: 'upi',
        idempotencyKey: 'idemp_seed_royal_1',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ],
    webhookLogs: [
      {
        id: 'wh_seed_1',
        eventId: 'evt_seed_royal_payment_captured',
        eventType: 'payment.captured',
        payload: JSON.stringify({ amount: 1499, payment_id: 'pay_test_seed_772819' }),
        receivedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ],
  };
}

async function loadDb(): Promise<DatabaseSchema> {
  await acquireLock();
  try {
    if (!inMemoryDb) {
      inMemoryDb = getInitialSeed();
    }

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
        return inMemoryDb;
      }

      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw) as DatabaseSchema;
      inMemoryDb = {
        enquiries: Array.isArray(data.enquiries) ? data.enquiries : inMemoryDb.enquiries,
        orders: Array.isArray(data.orders) ? data.orders : inMemoryDb.orders,
        payments: Array.isArray(data.payments) ? data.payments : inMemoryDb.payments,
        webhookLogs: Array.isArray(data.webhookLogs) ? data.webhookLogs : inMemoryDb.webhookLogs,
      };
      return inMemoryDb;
    } catch {
      return inMemoryDb;
    }
  } finally {
    releaseLock();
  }
}

async function writeDb(data: DatabaseSchema): Promise<void> {
  await acquireLock();
  try {
    inMemoryDb = data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.warn('Filesystem write bypassed, using memory state:', e);
    }
  } finally {
    releaseLock();
  }
}

// ================= ENQUIRIES REPOSITORY =================

export interface CreateEnquiryInput {
  customerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  businessName: string;
  category: string;
  preferredTemplate?: string;
  pagesNeeded?: string[];
  featuresNeeded?: string[];
  productsServices?: string;
  preferredColors?: string;
  domainNeeded?: boolean;
  domainName?: string;
  budgetRange?: string;
  targetDate?: string;
  referenceLinks?: string;
  additionalNotes?: string;
  packageType?: PackageType;
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
  const db = await loadDb();

  const id = `enq_${crypto.randomBytes(10).toString('hex')}`;
  const enquiryNumber = generateEnquiryNumber();
  const accessToken = generateSecureToken();
  const now = new Date().toISOString();

  // If a fixed package was selected (e.g., smart or royal), pre-populate standard package price
  let quotedAmount: number | null = null;
  let quoteScope: string | null = null;
  let quoteExclusions: string | null = null;
  let status: EnquiryStatus = 'pending';

  if (input.packageType && input.packageType !== 'custom' && input.packageType !== 'starter') {
    const pkg = FIXED_PACKAGES[input.packageType];
    if (pkg) {
      quotedAmount = pkg.price;
      quoteScope = pkg.features.join('\n');
      quoteExclusions = pkg.exclusions.join('\n');
      status = 'quoted';
    }
  }

  const enquiry: Enquiry = {
    id,
    enquiryNumber,
    accessToken,
    customerName: input.customerName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    whatsapp: input.whatsapp ? input.whatsapp.trim() : input.phone.trim(),
    businessName: input.businessName.trim(),
    category: input.category,
    preferredTemplate: input.preferredTemplate,
    pagesNeeded: input.pagesNeeded || [],
    featuresNeeded: input.featuresNeeded || [],
    productsServices: input.productsServices,
    preferredColors: input.preferredColors,
    domainNeeded: Boolean(input.domainNeeded),
    domainName: input.domainName,
    budgetRange: input.budgetRange,
    targetDate: input.targetDate,
    referenceLinks: input.referenceLinks,
    additionalNotes: input.additionalNotes,
    status,
    packageType: input.packageType || 'custom',
    quotedAmount,
    quoteScope,
    quoteExclusions,
    quoteTerms: 'Standard 1-year hosting with 3-day turnaround upon payment.',
    quoteSentAt: quotedAmount ? now : null,
    paymentStatus: 'unpaid',
    createdAt: now,
    updatedAt: now,
  };

  db.enquiries.unshift(enquiry);
  await writeDb(db);
  return enquiry;
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  const db = await loadDb();
  return db.enquiries.find((e) => e.id === id) || null;
}

export async function getEnquiryByToken(accessToken: string): Promise<Enquiry | null> {
  if (!accessToken || accessToken.trim().length === 0) return null;
  const db = await loadDb();
  return db.enquiries.find((e) => e.accessToken === accessToken) || null;
}

export async function getEnquiryByNumber(enquiryNumber: string): Promise<Enquiry | null> {
  const db = await loadDb();
  return db.enquiries.find((e) => e.enquiryNumber.toLowerCase() === enquiryNumber.toLowerCase()) || null;
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  const db = await loadDb();
  // Return sorted descending by creation time
  return [...db.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
  const db = await loadDb();
  const index = db.enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  const updated: Enquiry = {
    ...db.enquiries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.enquiries[index] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const db = await loadDb();
  const initialLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  if (db.enquiries.length !== initialLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

// ================= ORDERS REPOSITORY =================

export interface CreateOrderInput {
  enquiryId: string;
  orderType: 'fixed_package' | 'approved_quote';
  packageType?: PackageType;
  description: string;
  amount: number; // in INR
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const db = await loadDb();

  const id = `ord_${crypto.randomBytes(10).toString('hex')}`;
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const order: Order = {
    id,
    orderNumber,
    enquiryId: input.enquiryId,
    orderType: input.orderType,
    packageType: input.packageType,
    description: input.description,
    amount: Math.round(input.amount),
    currency: 'INR',
    status: 'created',
    createdAt: now,
    updatedAt: now,
  };

  db.orders.unshift(order);
  await writeDb(db);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await loadDb();
  return db.orders.find((o) => o.id === id) || null;
}

export async function getOrdersByEnquiryId(enquiryId: string): Promise<Order[]> {
  const db = await loadDb();
  return db.orders.filter((o) => o.enquiryId === enquiryId);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  const db = await loadDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated: Order = {
    ...db.orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.orders[index] = updated;
  await writeDb(db);
  return updated;
}

// ================= PAYMENTS REPOSITORY =================

export interface CreatePaymentInput {
  enquiryId: string;
  orderId?: string;
  razorpayOrderId: string;
  amount: number;
  currency?: string;
  idempotencyKey?: string;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const db = await loadDb();

  const id = `pay_${crypto.randomBytes(10).toString('hex')}`;
  const now = new Date().toISOString();

  const payment: Payment = {
    id,
    enquiryId: input.enquiryId,
    orderId: input.orderId || null,
    razorpayOrderId: input.razorpayOrderId,
    amount: input.amount,
    currency: input.currency || 'INR',
    status: 'created',
    idempotencyKey: input.idempotencyKey || null,
    createdAt: now,
    updatedAt: now,
  };

  db.payments.unshift(payment);
  await writeDb(db);
  return payment;
}

export async function getPaymentByRazorpayOrderId(orderId: string): Promise<Payment | null> {
  const db = await loadDb();
  return db.payments.find((p) => p.razorpayOrderId === orderId) || null;
}

export async function getPaymentsByEnquiryId(enquiryId: string): Promise<Payment[]> {
  const db = await loadDb();
  return db.payments.filter((p) => p.enquiryId === enquiryId);
}

export async function updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | null> {
  const db = await loadDb();
  const index = db.payments.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Payment = {
    ...db.payments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.payments[index] = updated;
  await writeDb(db);
  return updated;
}

// ================= WEBHOOK IDEMPOTENCY REPOSITORY =================

export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const db = await loadDb();
  return db.webhookLogs.some((l) => l.eventId === eventId);
}

export async function logWebhook(eventId: string, eventType: string, payload: unknown): Promise<void> {
  const db = await loadDb();
  const log: WebhookLog = {
    id: `wh_${Date.now()}`,
    eventId,
    eventType,
    payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
    receivedAt: new Date().toISOString(),
  };
  db.webhookLogs.unshift(log);
  await writeDb(db);
}
