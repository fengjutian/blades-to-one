
export interface CreatePromptInput {
  title: string;
  content: string;
  description?: string;
  tags?: string;
  version?: number;
  status?: string;
  author_id?: number;
  categoryId?: number;
  is_public?: boolean;
  source?: string;
  remarks?: string;
  role?: string;
}

export interface UpdatePromptInput {
  title?: string;
  content?: string;
  description?: string;
  tags?: string;
  version?: number;
  status?: string;
  categoryId?: number;
  is_public?: boolean;
  source?: string;
  remarks?: string;
  role?: string;
}

export interface GetPromptsQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  status?: string;
  author_id?: number;
  is_public?: boolean;
  tags?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
