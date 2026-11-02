import { useState } from 'react';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import type { Solution } from './modules/solution.model.ts';
import { SOLUTIONS_MOCK } from './modules/solutions.mock.ts';
import { SolutionsNavbar } from './components/SolutionsNavbar.tsx';

export interface SolutionsOutletContext {
  cards: Solution[];
  setCards: (cards: Solution[]) => void;
}

export const SolutionsLayout: FC = () => {
  const [cards, setCards] = useState<Solution[]>(SOLUTIONS_MOCK);

  return (
    <div className="screen">
      <Outlet context={{ cards, setCards }} />
      <SolutionsNavbar />
    </div>
  );
};
