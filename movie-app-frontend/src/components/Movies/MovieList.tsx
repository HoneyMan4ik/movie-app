import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchMovies, deleteMovie, setQuery } from '../../store/slices/moviesSlice';
import MovieModal from './MovieModal';
import MovieDetailModal from './MovieDetailModal';
import { Movie, MovieQueryParams } from '../../types/index';
import styles from './MovieList.module.css';
import api from '../../services/api';

const SORT_OPTIONS: { field: MovieQueryParams['sortBy']; label: string }[] = [
  { field: 'title', label: 'Title' },
  { field: 'year', label: 'Year' },
  { field: 'rating', label: 'Rating' },
  { field: 'createdAt', label: 'Date Added' },
];

export default function MovieList() {
  const dispatch = useAppDispatch();
  const { movies, meta, loading, query } = useAppSelector((s) => s.movies);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setQuery({ search: searchInput || undefined, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch(fetchMovies(query));
  }, [dispatch, query]);

  useEffect(() => {
    api.get<string[]>('/movies/genres').then((r) => setAvailableGenres(r.data));
  }, [movies]);

  const handleSort = (field: MovieQueryParams['sortBy']) => {
    const newOrder =
      query.sortBy === field && query.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setQuery({ sortBy: field, sortOrder: newOrder, page: 1 }));
  };

  const handleGenre = (genre: string) => {
    const newGenre = query.genre === genre ? undefined : genre;
    dispatch(setQuery({ genre: newGenre, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this movie?')) {
      await dispatch(deleteMovie(id));
      dispatch(fetchMovies(query));
    }
  };

  const openAdd = () => {
    setEditingMovie(null);
    setShowModal(true);
  };

  const openEdit = (movie: Movie, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleDelete(id);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMovie(null);
    dispatch(fetchMovies(query));
  };

  const isFiltered =
    query.sortBy !== 'createdAt' ||
    query.sortOrder !== 'desc' ||
    !!searchInput ||
    !!query.genre;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchInput('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <button className={styles.addBtn} onClick={openAdd}>
          + Add Movie
        </button>
      </div>

      <div className={styles.sortBar}>
        <span className={styles.sortLabel}>Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.field}
            className={`${styles.sortChip} ${query.sortBy === opt.field ? styles.sortChipActive : ''}`}
            onClick={() => handleSort(opt.field)}
          >
            {opt.label}
            {query.sortBy === opt.field && (
              <span className={styles.sortArrow}>
                {query.sortOrder === 'asc' ? ' ▲' : ' ▼'}
              </span>
            )}
          </button>
        ))}

        <span className={styles.sortDivider}>|</span>
        <span className={styles.sortLabel}>Genre:</span>

        <select
          className={styles.genreSelect}
          value={query.genre || ''}
          onChange={(e) => handleGenre(e.target.value)}
        >
          <option value="">All</option>
          {availableGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {isFiltered && (
          <button
            className={styles.resetBtn}
            onClick={() => {
              setSearchInput('');
              dispatch(setQuery({
                sortBy: 'createdAt',
                sortOrder: 'desc',
                search: undefined,
                genre: undefined,
                page: 1,
              }));
            }}
          >
            Reset
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading movies...</div>
      ) : movies.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No movies found</p>
          <p className={styles.emptySub}>
            {isFiltered
              ? 'Try changing your filters'
              : 'Add your first favorite movie to get started'}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {movies.map((movie: Movie) => (
              <div
                className={styles.card}
                key={movie.id}
                onClick={() => setDetailMovie(movie)}
              >
                <div className={styles.posterWrapper}>
                  {movie.posterUrl ? (
                    <img
                      className={styles.posterImg}
                      src={movie.posterUrl}
                      alt={movie.title}
                    />
                  ) : (
                    <div className={styles.posterPlaceholder}></div>
                  )}
                  {movie.rating != null && (
                    <div className={styles.ratingBadge}>★ {movie.rating}</div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{movie.title}</div>
                  <div className={styles.cardMeta}>
                    {movie.director || 'Unknown'}
                    {movie.year && (
                      <>
                        <span className={styles.cardMetaDivider}>·</span>
                        {movie.year}
                      </>
                    )}
                  </div>
                  {movie.genre && (
                    <span className={styles.genre}>{movie.genre}</span>
                  )}
                  {movie.description && (
                    <div className={styles.cardDescription}>
                      {movie.description}
                    </div>
                  )}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.editBtn}
                      onClick={(e) => openEdit(movie, e)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleDeleteClick(movie.id, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => dispatch(setQuery({ page: (query.page || 1) - 1 }))}
                disabled={(query.page || 1) <= 1}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>
                {meta.page} / {meta.totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => dispatch(setQuery({ page: (query.page || 1) + 1 }))}
                disabled={(query.page || 1) >= meta.totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <MovieModal movie={editingMovie} onClose={closeModal} />
      )}

      {detailMovie && (
        <MovieDetailModal
          movie={detailMovie}
          onClose={() => setDetailMovie(null)}
          onEdit={(movie: Movie) => {
            setDetailMovie(null);
            setEditingMovie(movie);
            setShowModal(true);
          }}
          onDelete={(id: string) => {
            setDetailMovie(null);
            handleDelete(id);
          }}
        />
      )}
    </div>
  );
}