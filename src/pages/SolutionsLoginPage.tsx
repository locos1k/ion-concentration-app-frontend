import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import axios, { isAxiosError } from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { setUser } from '../store/slices/userSlice.ts';

const SolutionsLoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isAuthenticated) return <Navigate to={ROUTES.GRID} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await axios.post<{ id: number; username: string }>(
        '/api/auth/login',
        { username, password },
        { withCredentials: true },
      );
      dispatch(setUser(response.data));
      navigate(ROUTES.GRID);
    } catch (e) {
      setError(
        isAxiosError(e) && e.response?.status === 401
          ? 'Неверный логин или пароль'
          : 'Сервер недоступен, попробуйте позже',
      );
      setPending(false);
    }
  };

  return (
    <div className="page-body form-screen">
      <h1 className="title">Вход</h1>
      <Form className="form-body" onSubmit={handleSubmit}>
        <Form.Group controlId="login-username">
          <Form.Label className="field-label">Логин</Form.Label>
          <Form.Control
            className="dark-input"
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            disabled={pending}
          />
        </Form.Group>
        <Form.Group controlId="login-password">
          <Form.Label className="field-label">Пароль</Form.Label>
          <Form.Control
            className="dark-input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={pending}
          />
        </Form.Group>
        {error && <Alert className="form-error">{error}</Alert>}
        <Button type="submit" className="filter-btn form-submit" disabled={pending}>
          {pending ? <Spinner animation="border" size="sm" /> : 'Войти'}
        </Button>
      </Form>
    </div>
  );
};

export default SolutionsLoginPage;
