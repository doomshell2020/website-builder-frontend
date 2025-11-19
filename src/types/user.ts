export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  mobile_no?: string | null;
  office_no?: string | null;
  fax_no?: string | null;
  fburl?: string | null;
  xurl?: string | null;
  linkedinurl?: string | null;
  instaurl?: string | null;
  yturl?: string | null;
  address1?: string;
  address2?: string;
  roleData?: any;
  role?: string;
  websiteType?: any;
  Theme?: any;
  company_name?: string | null;
  imageFolder?: string | null;
  subdomain?: string | null;
  custom_domain?: string | null;
  schema_name?: string | null;
  company_logo?: string | null;
  gstin?: string | null;
  image?: string | null;
  subscriptionData?: any;
  status?: 'Y' | 'N';
  gst_type?: 'IGST' | 'CGST_SGST';
  approval?: 'Y' | 'N';
  createdAt?: Date;
  updatedAt?: Date;
  result?: any;
}

export interface Schemas {
  schemaName?: string;
  users?: any;
  tables?: any;
  result?: any;
  data: any;
};