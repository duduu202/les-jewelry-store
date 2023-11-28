interface IUpdateProductDTO {
  price?: number;
  stock?: number;
  name?: string;
  description?: string;
  id: string;
  request_id: string;
  categories?: string[];
}

export { IUpdateProductDTO };
