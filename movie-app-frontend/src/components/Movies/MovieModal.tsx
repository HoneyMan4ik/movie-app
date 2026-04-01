import { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { createMovie, updateMovie } from '../../store/slices/moviesSlice';
import { Movie } from '../../types';
import styles from './MovieModal.module.css';

interface Props {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: Props) {
  const dispatch = useAppDispatch();
  const isEdit = !!movie;

  const [title, setTitle] = useState(movie?.title || '');
  const [director, setDirector] = useState(movie?.director || '');
  const [year, setYear] = useState(movie?.year?.toString() || '');
  const [genre, setGenre] = useState(movie?.genre || '');
  const [rating, setRating] = useState(movie?.rating?.toString() || '');
  const [description, setDescription] = useState(movie?.description || '');
  const [posterUrl, setPosterUrl] = useState(movie?.posterUrl || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const yearNum = year ? parseInt(year) : undefined;
    if (year && (isNaN(yearNum!) || yearNum! < 1888 || yearNum! > 2030)) {
      setError('Year must be between 1888 and 2030');
      return;
    }

    const ratingNum = rating ? parseFloat(rating) : undefined;
    if (rating && (isNaN(ratingNum!) || ratingNum! < 0 || ratingNum! > 10)) {
      setError('Rating must be between 0 and 10');
      return;
    }

    const payload = {
      title: title.trim(),
      director: director.trim() || undefined,
      year: yearNum,
      genre: genre.trim() || undefined,
      rating: ratingNum,
      description: description.trim() || undefined,
      posterUrl: posterUrl.trim() || undefined,
    };

    setSaving(true);

    try {
      if (isEdit) {
        await dispatch(updateMovie({ id: movie.id, data: payload })).unwrap();
      } else {
        await dispatch(createMovie(payload)).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Movie' : 'Add Movie'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Title *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Interstellar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Director</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Christopher Nolan"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year</label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 2014"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1888}
                max={2030}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Genre</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Sci-Fi"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Rating (0-10)</label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 9.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              placeholder="What's the movie about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Poster URL</label>
            <input
              className={styles.input}
              type="url"
              placeholder="https://..."
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Movie'}
          </button>
        </form>
      </div>
    </div>
  );
}
