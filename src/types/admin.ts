// types/admin.ts

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface AdminLoginResponse {
  status: boolean;
  access_token: string;
  message?: string;
}
