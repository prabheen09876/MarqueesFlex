export interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}
