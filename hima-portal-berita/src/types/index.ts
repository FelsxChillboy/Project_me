import type { Role, Status } from "@prisma/client";

export type { Role, Status };

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface SafeAuthor {
  id: string;
  name: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
}

export interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  status: Status;
  views: number;
  authorId: string;
  categoryId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string | null;
  author: SafeAuthor;
  category: { id: string; name: string; slug: string };
}
