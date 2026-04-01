export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Movie {
  id: string;
  title: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number;
  description?: string;
  posterUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMoviePayload {
  title: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number;
  description?: string;
  posterUrl?: string;
}

export interface UpdateMoviePayload extends Partial<CreateMoviePayload> {}

export interface MovieQueryParams {
  search?: string;
  sortBy?: 'title' | 'year' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  genre?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
