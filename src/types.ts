export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomOrder {
  id?: number;
  name: string;
  phone: string;
  description: string;
  images?: File[];
  status?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
}