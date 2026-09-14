export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
  companyId: string;
  companyName: string;
}

export interface AuthSession {
  token: string;
  recruiter: Recruiter;
}
