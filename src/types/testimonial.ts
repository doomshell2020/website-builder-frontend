export interface Testimonial {
  id?: number;
  name: string;
  company_logo?: string;
  cat_id?: number;
  subcat_id?: number;
  desig?: string | null;
  description?: string;
  image?: string;
  url?: string;
  status: "Y" | "N";
  createdAt?: string | Date;
  updatedAt?: string | Date;
  res?: any;
  result?: any;
}

export interface TestimonialFormData {
  id?: number;
  name: string;
  company_logo?: string;
  cat_id?: number;
  subcat_id?: number;
  desig?: string | null;
  description?: string;
  image?: string;
  url?: string;
  status: "Y" | "N";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
