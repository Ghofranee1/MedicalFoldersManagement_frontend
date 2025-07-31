export interface ApiResponse<T> {
  message: string;
  data: T;
  total?: number;
  patientIpp?: string;
}