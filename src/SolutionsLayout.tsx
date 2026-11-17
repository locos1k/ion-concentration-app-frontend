import type { FC } from 'react';
import { Spinner } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { SolutionsNavbar } from './components/SolutionsNavbar.tsx';
import { selectIsLoading, useAppSelector } from './store/hooks.ts';

export const SolutionsLayout: FC = () => {
  const isLoading = useAppSelector(selectIsLoading);

  return (
    <div className="screen">
      <Outlet />
      <SolutionsNavbar />
      {isLoading && (
        <div className="loading-overlay" role="status" aria-label="Загрузка">
          <Spinner animation="border" className="loading-spinner" />
        </div>
      )}
    </div>
  );
};
