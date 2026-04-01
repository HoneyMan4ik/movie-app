import { Movie } from '../../types';
import styles from './MovieDetailModal.module.css';

interface Props {
  movie: Movie;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
}

export default function MovieDetailModal({ movie, onClose, onEdit, onDelete }: Props) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this movie?')) {
      onDelete(movie.id);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

        <div className={styles.layout}>

          <div className={styles.posterCol}>
            {movie.posterUrl ? (
              <img
                className={styles.poster}
                src={movie.posterUrl}
                alt={movie.title}
              />
            ) : (
              <div className={styles.posterPlaceholder}>🎬</div>
            )}
            {movie.rating != null && (
              <div className={styles.ratingBadge}>★ {movie.rating} / 10</div>
            )}
          </div>

          <div className={styles.infoCol}>
            <h2 className={styles.title}>{movie.title}</h2>

            <div className={styles.meta}>
              {movie.director && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Director</span>
                  <span className={styles.metaValue}>{movie.director}</span>
                </div>
              )}
              {movie.year && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Year</span>
                  <span className={styles.metaValue}>{movie.year}</span>
                </div>
              )}
              {movie.genre && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Genre</span>
                  <span className={styles.genrePill}>{movie.genre}</span>
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Added</span>
                <span className={styles.metaValue}>
                  {new Date(movie.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {movie.description && (
              <div className={styles.description}>
                <p className={styles.descLabel}>About</p>
                <p className={styles.descText}>{movie.description}</p>
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => onEdit(movie)}>
                Edit Movie
              </button>
              <button className={styles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}