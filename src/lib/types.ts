export type ProductStatus = "active" | "draft" | "archived" | "out_of_stock";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductColor {
  name: string; // "Red", "Sage green"
  hex: string; // "#c9a86e" — used for the swatch
  image: string; // URL of the image shown when this color is selected
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  category: string;
  collections: string[];
  images: ProductImage[];
  mrp: number;
  price: number; // selling price
  discountPercent?: number;
  couponEligible?: boolean;
  stock: number;
  lowStockThreshold: number;
  weightGrams: number;
  dimensions: string;
  fragrance: string;
  fragranceNotes: { top: string[]; heart: string[]; base: string[] };
  waxType: string;
  burnTimeHours: number;
  ingredients: string[];
  careInstructions: string[];
  tags: string[];
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  rating: number;
  reviewCount: number;
  /* Optional colour variants. When present, the product page shows swatches
   * and switching a swatch swaps the main image. */
  colors?: ProductColor[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  featured?: boolean;
  productIds: string[];
  /* Optional parent-collection slug. When set, this collection is treated as a
   * sub-category (e.g. "diwali" under "the-occasion-edit"). Top-level
   * collections leave this undefined. */
  parentSlug?: string;
  /* When true, this collection is featured as a product carousel on the
   * home page (above Best Sellers). Great for time-limited edits like
   * Rakhi, Diwali, Christmas — toggle off when the occasion is over. */
  pinToHome?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderAt?: string;
  addresses: {
    id: string;
    label: string;
    line1: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  }[];
  createdAt: string;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  createdAt: string;
  items: {
    productId: string;
    name: string;
    image: string;
    qty: number;
    price: number;
    fragrance?: string;
    color?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  coupon?: string;
  address: {
    name: string;
    phone: string;
    line1: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  giftMessage?: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
  perCustomerLimit?: number;
  productIds?: string[];
  collectionIds?: string[];
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  cta: string;
  active: boolean;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  approved: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface GiftEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  budget: string;
  quantity: string;
  fragrance?: string;
  candle?: string;
  message?: string;
  additional?: string;
  createdAt: string;
  status: "new" | "in_progress" | "closed";
}

export interface InstagramPost {
  id: string;
  image: string;
  link: string;
  caption?: string;
  order: number;
}

export interface Settings {
  freeShippingAbove: number;
  currency: "INR";
  announcementBar: string;
  socials: {
    instagram: string;
    whatsapp: string;
    pinterest?: string;
    facebook?: string;
    youtube?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  homepage: {
    heroHeading: string;
    heroSubheading: string;
    heroImage: string;
    heroCtaLabel: string;
    heroCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    story?: {
      eyebrow?: string;
      heading?: string;
      body1?: string;
      body2?: string;
      image?: string;
      ctaLabel?: string;
      ctaHref?: string;
    };
    giftingBanner?: {
      eyebrow?: string;
      heading?: string;
      body?: string;
      image?: string;
      ctaLabel?: string;
      ctaHref?: string;
    };
  };
  /* About-page content — every field editable in /admin/about. */
  about?: {
    eyebrow?: string;
    heading?: string;
    intro?: string;
    image?: string;
    craftEyebrow?: string;
    craftBody?: string;
    quoteEyebrow?: string;
    quote?: string;
  };
}
