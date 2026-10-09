export type EnquiryStatus = 
  | 'pending'
  | 'reviewing'
  | 'in_review'
  | 'quoted'
  | 'quote_accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'failed';

export type PackageType = 'starter' | 'smart' | 'royal' | 'custom';

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  accessToken: string;
  
  // Customer details
  customerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  
  // Business details
  businessName: string;
  category: string;
  preferredTemplate?: string;
  
  // Project requirements
  pagesNeeded?: string[];
  featuresNeeded?: string[];
  productsServices?: string;
  preferredColors?: string;
  domainNeeded: boolean;
  domainName?: string;
  budgetRange?: string;
  targetDate?: string;
  referenceLinks?: string;
  additionalNotes?: string;
  
  // Status & Quotes
  status: EnquiryStatus;
  packageType?: PackageType;
  quotedAmount?: number | null; // in INR
  quoteScope?: string | null;
  quoteExclusions?: string | null;
  quoteTerms?: string | null;
  quoteSentAt?: string | null;
  quoteAcceptedAt?: string | null;
  
  // Payment tracking
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  paidAmount?: number | null;
  paidAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  enquiryId: string;
  orderType: 'fixed_package' | 'approved_quote';
  packageType?: PackageType;
  description: string;
  amount: number; // in INR
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  enquiryId: string;
  orderId?: string | null;
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  amount: number; // in INR
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed';
  method?: string | null;
  errorDescription?: string | null;
  errorMessage?: string | null;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  eventId: string;
  eventType: string;
  payload: string;
  receivedAt: string;
}

export interface FixedPackage {
  id: PackageType;
  name: string;
  price: number; // in INR
  description: string;
  features: string[];
  exclusions: string[];
  deliveryDays: number;
}
