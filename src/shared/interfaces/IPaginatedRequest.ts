interface IPaginatedRequest<T> {
  page?: number;
  limit?: number;
  filters?: Partial<T>; // where
  include?: { [key: string]: boolean }; // include
  search?: string;
}

export { IPaginatedRequest };

/*
interface IPaginatedRequest<T> {
  page?: number;
  limit?: number;
  filters?: Partial<T>; // where
  include?: { [key: string]: boolean }; // include
  search?: Partial<T> | { OR: Partial<T>[] };
}

export { IPaginatedRequest };
*/
