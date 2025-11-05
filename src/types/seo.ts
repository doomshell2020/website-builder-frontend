export interface Seo {
  id: number;
  orgid: number;
  type: string | null;
  page: string;
  location: string;
  keyword: string | null;
  description: string | null;
  title: string | null;
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoFormData {
  id: number;
  orgid: number;
  type: string | null;
  page: string;
  location: string;
  keyword: string | null;
  description: string | null;
  title: string | null;
  status: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}
