export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'banner' | 'neon' | 'frame' | 'flex' | 'anime' | 'aesthetic' | 'cars';
}

export interface CartItem extends Product {
  quantity: number;
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