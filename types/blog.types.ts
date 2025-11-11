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

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  total: number;
  error?: string;
}

export interface BlogDetailResponse {
  success: boolean;
  data: BlogDetail;
  error?: string;
}
