import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { moviesService } from '../../services/movies.service';
import { Movie, MovieQueryParams, PaginatedResponse, CreateMoviePayload, UpdateMoviePayload } from '../../types';

interface MoviesState {
  movies: Movie[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  loading: boolean;
  error: string | null;
  query: MovieQueryParams;
}

const initialState: MoviesState = {
  movies: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  loading: false,
  error: null,
  query: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' },
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async (params: MovieQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await moviesService.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch movies');
    }
  },
);

export const createMovie = createAsyncThunk(
  'movies/create',
  async (data: CreateMoviePayload, { rejectWithValue }) => {
    try {
      return await moviesService.create(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create movie');
    }
  },
);

export const updateMovie = createAsyncThunk(
  'movies/update',
  async ({ id, data }: { id: string; data: UpdateMoviePayload }, { rejectWithValue }) => {
    try {
      return await moviesService.update(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update movie');
    }
  },
);

export const deleteMovie = createAsyncThunk(
  'movies/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await moviesService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete movie');
    }
  },
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<Partial<MovieQueryParams>>) => {
      state.query = { ...state.query, ...action.payload };
    },
    clearMoviesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action: PayloadAction<PaginatedResponse<Movie>>) => {
      state.loading = false;
      state.movies = action.payload.data;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
      state.movies.unshift(action.payload);
      state.meta.total += 1;
    });
    builder.addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
      const idx = state.movies.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.movies[idx] = action.payload;
    });
    builder.addCase(deleteMovie.fulfilled, (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter((m) => m.id !== action.payload);
      state.meta.total -= 1;
    });
  },
});

export const { setQuery, clearMoviesError } = moviesSlice.actions;
export default moviesSlice.reducer;
