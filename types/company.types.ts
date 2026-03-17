/**
 * Company type definitions
 */

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  rating: number;
  reviews: number;
  employees: number;
  openJobs: number;
  description: string;
  logo: string;
  featured: boolean;
  isVerified?: boolean;
  linkedinUrl?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy optional fields (not in DB schema)
  foundedYear?: number;
  companySize?: string;
  benefits?: string[];
}

export interface CompanyFormData {
  name: string;
  industry: string;
  location: string;
  description: string;
  logo: string;
  website?: string;
  foundedYear?: number;
  companySize?: string;
  employees: number;
  benefits?: string;
}

export interface UpdateCompanyRequest {
  companyId: string | number;
  data: Partial<CompanyFormData>;
}

export interface CompanyResponse {
  success: boolean;
  data: Company;
  error?: string;
}

export interface CompaniesResponse {
  success: boolean;
  data: Company[];
  total: number;
  error?: string;
}
