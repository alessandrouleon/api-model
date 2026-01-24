
export interface FindFilterInterface<TFilter = any> {
  filter?: TFilter;
  search?: string;
  order?: 'asc' | 'desc';
  orderby?: string;
  limit?: number;
  skip?: number;
  page?: number;
}

export interface PaginationInterface {
  page: number;
  size: number;
  totalPages: number;
  total: number;
}

export interface PaginationResultInterface<T> {
  pagination: PaginationInterface;
  result: T[];
}

export default interface RepositoryInterface<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<T>;
  findOneById(id: string): Promise<T>;
  find(filter: FindFilterInterface): Promise<PaginationResultInterface<T>>;
}
