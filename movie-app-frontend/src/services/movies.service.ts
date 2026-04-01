import api from './api';
import { Movie, CreateMoviePayload, UpdateMoviePayload, MovieQueryParams, PaginatedResponse } from '../types';

export const moviesService = {
  getAll: (params?: MovieQueryParams) =>
    api.get<PaginatedResponse<Movie>>('/movies', { params }).then((r) => r.data),

  getOne: (id: string) =>
    api.get<Movie>(`/movies/${id}`).then((r) => r.data),

  create: (data: CreateMoviePayload) =>
    api.post<Movie>('/movies', data).then((r) => r.data),

  update: (id: string, data: UpdateMoviePayload) =>
    api.put<Movie>(`/movies/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/movies/${id}`).then((r) => r.data),
};
