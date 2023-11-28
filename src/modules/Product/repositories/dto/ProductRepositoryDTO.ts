export interface IProductCreate {
  price: number;
  stock: number;
  name: string;
  image?: string;
  description: string;
  user_id?: string;
  categories?: string[];
}

export interface IProductUpdate {
  id: string;
  price: number;
  stock: number;
  name: string;
  image?: string;
  description: string;
  user_id?: string;
  categories?: string[];
}
