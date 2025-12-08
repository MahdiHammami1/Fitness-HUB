// Wouhouch Hub Types

export interface CoachingOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  popular?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'closed';
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating?: number;
  beforeImage?: string;
  afterImage?: string;
  consent: boolean;
  approved: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  location: string;
  capacity: number;
  currentRegistrations: number;
  price: number;
  isFree: boolean;
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  acceptedTerms: boolean;
  createdAt: Date;
}

export type ProductCollection = 'SUPPLEMENTS_GEAR' | 'APPAREL';

export interface ProductVariant {
  id: string;
  productId: string;
  variantType: 'size' | 'flavor' | 'color';
  value: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  collection: ProductCollection;
  images: string[];
  stock: number;
  isActive: boolean;
  variants?: ProductVariant[];
  ingredients?: string;
  usage?: string;
  warnings?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'prepared' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  address: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  qty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COACH' | 'CUSTOMER';
}
