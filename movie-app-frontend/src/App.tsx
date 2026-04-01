import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useAppDispatch';
import Header from './components/Layout/Header';
import AuthPage from './components/Auth/AuthPage';
import MovieList from './components/Movies/MovieList';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';

function AppRoutes() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <MovieList />
            </>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
