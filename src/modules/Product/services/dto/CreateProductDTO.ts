interface ICreateProductDTO {
  price: number;
  stock: number;
  name: string;
  description?: string;
  image?: string;
  categories?: string[];
}

export { ICreateProductDTO };
