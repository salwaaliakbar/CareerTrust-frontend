// Blog type definitions
export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

export interface BlogDetail extends Blog {
  content: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface BlogsListPayload {
  items: Blog[];
  pagination: PaginationMeta;
  totalCount: number;
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[] | BlogsListPayload;
  total?: number;
  pagination?: PaginationMeta;
  error?: string;
}

export interface BlogDetailResponse {
  success: boolean;
  data: BlogDetail;
  error?: string;
}
