export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: number;
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  product_id: number;
  product_name?: string;
  quantity: number;
  type: 'pickup' | 'delivery';
  address?: string;
  pickup_time?: string;
  notes?: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  created_at: string;
}

export interface CakeRequest {
  id: number;
  customer_name: string;
  phone: string;
  flavor: string;
  size: string;
  description: string;
  image_url?: string;
  pickup_date: string;
  status: 'Pending' | 'In Progress' | 'Ready';
  admin_notes?: string;
  created_at: string;
}

export interface CateringRequest {
  id: number;
  event_type: string;
  guests: number;
  items: string;
  budget: string;
  event_date: string;
  customer_name: string;
  phone: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  admin_notes?: string;
  created_at: string;
}

export interface Special {
  id: number;
  title: string;
  description: string;
  price: number;
  active: number;
}
