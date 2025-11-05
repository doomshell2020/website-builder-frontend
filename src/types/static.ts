export interface Static {
  id?: number;
  title: string;
  url?: string | null;
  image?: File[]; // ✅ Array of files
  content: string;
  status?: "Y" | "N";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  res?: any;
  result?: any;
}

export interface StaticFormData {
  id?: number;
  title: string;
  url?: string | null;
  image?: File[]; // ✅ Array of files
  content: string;
  status?: "Y" | "N";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  res?: any;
  result?: any;
}