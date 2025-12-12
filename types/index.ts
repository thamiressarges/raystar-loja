export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  products?: Product[];
}

export interface Variation {
  id: string;
  product_id: string;
  price: number;
  size: string | null; 
  color: string | null; 
  stock: number;
  is_available: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  created_at: string;
  is_available: boolean;
  category_id?: string;
  category?: Category;
  variations?: Variation[];
  rating?: number;
  total_reviews?: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  variation_id?: string;
  store_id?: string;
}

export interface UserAddress {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city: string;
  state: string;
  zip: string; 
}

export interface UserDetails {
  uid: string;
  name: string | null;
  email: string;
  cpf: string | null;
  phone: string | null;
  birth_date: string | null;
  address: UserAddress | null;
}

export interface Review {
  id: string;
  product_id: string;
  client_id: string;
  rating: number;
  title: string | null;
  text: string | null;
  created_at: string;
  user_name?: string;
}

export type OrderStatus = 
  | 'pending' | 'aguardando_pagamento' | 'pedido_criado'
  | 'paid' | 'pago' | 'pagamento_confirmado' | 'succeeded'
  | 'preparing' | 'preparando_pedido' | 'em_andamento'
  | 'shipped' | 'enviado' | 'out_for_delivery' | 'saiu_para_entrega'
  | 'delivered' | 'entregue'
  | 'canceled' | 'cancelado' | 'falhou' | 'failed' | 'pagamento_recusado' | 'devolvido';

export interface PaymentInfo {
  id: string;
  status: string;
  method: 'card' | 'cartao' | 'pix' | 'boleto'; 
  value: number;
  installments: number;
  payload?: any;
}

export interface DeliveryInfo {
  id: string;
  status: string;
  tracking_code: string | null;
  cost: number;
  type: 'delivery' | 'pickup';
  address?: UserAddress;
  deadline_days?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variation_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
}

export interface Order {
  id: string;
  client_id: string;
  status: OrderStatus; 
  created_at: string;
  total_amount: number;
  items: OrderItem[];
  delivery?: DeliveryInfo;
  payment?: PaymentInfo;
}

export interface StoreInfo {
  id?: string; 
  email?: string;
  phones?: string[];
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
  social_media?: {
    facebook?: string;
    instagram?: string;
  };
}

export interface CheckoutState {
  success: boolean;
  message?: string;
  orderId?: string;
  pix?: { qr_code: string; qr_code_url: string };
  boleto?: { url: string; barcode: string };
}

export interface FormState {
  status: 'success' | 'error' | 'idle';
  message: string;
  errors?: Record<string, string[]>;
}