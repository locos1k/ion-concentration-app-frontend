import type { FC, ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './Routes.ts';
import { SolutionsLayout } from './SolutionsLayout.tsx';
import SolutionsAddPage from './pages/SolutionsAddPage.tsx';
import SolutionsFeedPage from './pages/SolutionsFeedPage.tsx';
import SolutionsGridPage from './pages/SolutionsGridPage.tsx';
import SolutionsLoginPage from './pages/SolutionsLoginPage.tsx';
import { useAppSelector } from './store/hooks.ts';

const CreatorOnly: FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

const SolutionsApp: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<SolutionsLayout />}>
        <Route path={ROUTES.FEED} element={<SolutionsFeedPage />} />
        <Route path={`${ROUTES.FEED}/:id`} element={<SolutionsFeedPage />} />
        <Route path={ROUTES.GRID} element={<SolutionsGridPage />} />
        <Route
          path={ROUTES.ADD}
          element={
            <CreatorOnly>
              <SolutionsAddPage />
            </CreatorOnly>
          }
        />
        <Route path={ROUTES.LOGIN} element={<SolutionsLoginPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
    </Routes>
  </BrowserRouter>
);

export default SolutionsApp;
