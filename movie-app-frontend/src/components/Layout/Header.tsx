import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logoutUser } from '../../store/slices/authSlice';
import styles from './Header.module.css';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>My Movies</div>
      <nav className={styles.nav}>
        <span className={styles.username}>{user?.username}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Log out
        </button>
      </nav>
    </header>
  );
}
