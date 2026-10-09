import { FixedPackage, PackageType } from './db/types';

export const FIXED_PACKAGES: Record<PackageType, FixedPackage> = {
  starter: {
    id: 'starter',
    name: 'Digital Starter Demo',
    price: 0,
    description: 'Explore, design, and preview your shop website on mobile and desktop.',
    features: [
      'Interactive 20-category website builder',
      'Instant mobile & desktop live previews',
      'Local draft saving & JSON configuration export',
      'Pre-filled WhatsApp click-to-chat links',
      'Sample products & services catalog',
    ],
    exclusions: [
      'Custom domain name (.in / .com)',
      'Dedicated cloud hosting server',
      'Assisted catalogue photography',
      'Razorpay payment checkout gateway',
    ],
    deliveryDays: 0,
  },
  smart: {
    id: 'smart',
    name: 'Smart Dukaan Package',
    price: 1499,
    description: 'Complete production website hosted on your custom Netrawebai subdomain with full WhatsApp ordering.',
    features: [
      'Dedicated subdomain: yourshop.netrawebai.in',
      'Up to 100 products, photos & pricing catalog',
      'Direct WhatsApp order generator & Google Maps link',
      'High-speed cloud edge CDN hosting (1 year included)',
      'Free SSL security certificate (HTTPS padlock)',
      'Mobile-responsive layout optimized for smartphones',
      'Zero commission on orders or walk-ins',
    ],
    exclusions: [
      'Custom branded domain (.in / .com)',
      'Personal branded email accounts',
      'In-person studio photography',
    ],
    deliveryDays: 2,
  },
  royal: {
    id: 'royal',
    name: 'Royal Dukaan Package',
    price: 2999,
    description: 'Flagship enterprise presence with your own custom domain, priority setup, and business email.',
    features: [
      'Custom top-level domain registration (.in or .com for 1 year)',
      'Unlimited products, photo lookbooks & services',
      'Branded business email address (contact@yourshop.in)',
      'Priority onboarding assisted via WhatsApp video call',
      'Google Maps Business profile ranking optimization',
      'Custom logo design & color palette tuning',
      'High-speed global cloud CDN with 99.9% uptime SLA',
    ],
    exclusions: [
      'Monthly ongoing inventory management (available as add-on)',
      'Paid advertising budget (Google Ads / Meta Ads)',
    ],
    deliveryDays: 4,
  },
  custom: {
    id: 'custom',
    name: 'Bespoke Custom Dukaan',
    price: 0, // determined exclusively by owner quote
    description: 'Custom requirements tailored to your exact multi-branch, restaurant booking, or bridal salon needs.',
    features: [
      'Custom multi-page architecture as requested',
      'Custom forms, calculators & quote estimators',
      'Dedicated project manager & developer review',
      'Bespoke visual styling & animations',
    ],
    exclusions: [
      'Any features not approved in the signed scope document',
    ],
    deliveryDays: 7,
  },
};

export function getPackageById(packageId: PackageType): FixedPackage | undefined {
  return FIXED_PACKAGES[packageId];
}
