export interface IPaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
