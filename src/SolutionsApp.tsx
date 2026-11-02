import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './Routes.ts';
import { SolutionsLayout } from './SolutionsLayout.tsx';
import SolutionsFeedPage from './pages/SolutionsFeedPage.tsx';
import SolutionsGridPage from './pages/SolutionsGridPage.tsx';

const SolutionsApp: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<SolutionsLayout />}>
        <Route path={ROUTES.FEED} element={<SolutionsFeedPage />} />
        <Route path={`${ROUTES.FEED}/:id`} element={<SolutionsFeedPage />} />
        <Route path={ROUTES.GRID} element={<SolutionsGridPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
    </Routes>
  </BrowserRouter>
);

export default SolutionsApp;
