export type CategoryId =
  | 'mobile-shops'
  | 'mobile-repair'
  | 'clothing'
  | 'cafes'
  | 'restaurants'
  | 'jewellery'
  | 'kirana'
  | 'electronics'
  | 'salons'
  | 'shoe-shops'
  | 'furniture'
  | 'gift-shops'
  | 'bakeries'
  | 'medical-stores'
  | 'hardware'
  | 'automobile'
  | 'stationery'
  | 'home-decor'
  | 'sports'
  | 'other';

export interface ShopCategory {
  id: CategoryId;
  name: string;
  hindiName: string;
  description: string;
  iconName: string;
  image: string;
  templateCount: number;
  featuredShopSlug: string;
  accentColor: string;
  tags: string[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  badge?: string;
  inStock: boolean;
  featured?: boolean;
  specs?: ProductSpec[];
  sizes?: string[];
  unit?: string; // e.g. "kg", "500g", "piece", "packet"
}

export interface ServiceItem {
  id: string;
  name: string;
  duration?: string;
  startingPrice: number;
  description: string;
  icon?: string;
  popular?: boolean;
}

export type TemplateStyle =
  | 'modern-minimal'
  | 'premium-luxury'
  | 'bold-colorful'
  | 'traditional-indian'
  | 'modern-ecommerce'
  | 'elegant-boutique'
  | 'restaurant-cafe'
  | 'professional-service'
  | 'dark-premium'
  | 'clean-simple';

export interface StorefrontTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: 'Inter' | 'Poppins' | 'Playfair' | 'Cinzel' | 'Outfit';
  mode: 'light' | 'dark' | 'auto';
  buttonStyle: 'rounded' | 'pill' | 'square';
  heroStyle: 'centered' | 'split' | 'fullscreen' | 'banner';
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl?: string;
  openingHours: string;
  closedOn?: string;
}

export interface Shop {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categorySlug: CategoryId;
  description: string;
  contact: ContactInfo;
  heroHeadline: string;
  heroSubheadline: string;
  bannerImage: string;
  logoImage?: string;
  theme: StorefrontTheme;
  templateId: string;
  templateStyle: TemplateStyle;
  products: Product[];
  services?: ServiceItem[];
  deliveryAvailable?: boolean;
  upiId?: string;
  rating?: number;
  reviewsCount?: number;
  foundedYear?: number;
  isDemo?: boolean;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  categorySlug: CategoryId;
  style: TemplateStyle;
  styleName: string;
  description: string;
  previewImage: string;
  colorScheme: string;
  badge?: string;
  features: string[];
}

export type PublishStatus = 'draft' | 'ready' | 'simulated_live';

export interface WebsiteDraft {
  id: string;
  slug: string;
  shopData: Shop;
  lastUpdated: string;
  step: number;
  status: PublishStatus;
  subdomain?: string;
  customDomain?: string;
}
