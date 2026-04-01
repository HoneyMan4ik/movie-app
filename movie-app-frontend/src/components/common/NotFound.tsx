import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.sub}>Looks like this scene was cut from the film.</p>
      <button className={styles.btn} onClick={() => navigate('/')}>
        ← Back to My Movies
      </button>
    </div>
  );
}