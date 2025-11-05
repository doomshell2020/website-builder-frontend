export interface ClientLogo {
  id?: number;
  seq: string;
  url: string;
  status?: "Y" | "N";
  image: string;
  createdAt?: Date;
  updated_at?: Date;
  res?: any;
  result?: any;
}

export interface ClientLogoFormData {
  id?: number;
  seq: string;
  url: string;
  status?: "Y" | "N";
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  res?: any;
  result?: any;
}
