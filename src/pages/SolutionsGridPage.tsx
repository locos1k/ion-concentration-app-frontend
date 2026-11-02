import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { SolutionsOutletContext } from '../SolutionsLayout.tsx';
import { SolutionCard } from '../components/SolutionCard.tsx';
import { SolutionsFilter } from '../components/SolutionsFilter.tsx';
import {
  FILTER_RANGE,
  filterSolutionsByConcentration,
} from '../modules/solutions.filter.ts';
import { SOLUTIONS_MOCK } from '../modules/solutions.mock.ts';

const SolutionsGridPage: FC = () => {
  const { setCards } = useOutletContext<SolutionsOutletContext>();
  const [min, setMin] = useState<number>(FILTER_RANGE.min);
  const [max, setMax] = useState<number>(FILTER_RANGE.max);
  const [appliedRange, setAppliedRange] = useState<{
    min: number;
    max: number;
  }>({
    min: FILTER_RANGE.min,
    max: FILTER_RANGE.max,
  });

  const solutions = useMemo(
    () =>
      filterSolutionsByConcentration(
        SOLUTIONS_MOCK,
        appliedRange.min,
        appliedRange.max,
      ),
    [appliedRange],
  );

  useEffect(() => {
    setCards(solutions);
  }, [solutions, setCards]);

  return (
    <div className="page-body grid-screen">
      <h1 className="title">Каталог растворов</h1>

      <SolutionsFilter
        min={min}
        max={max}
        setMin={setMin}
        setMax={setMax}
        onSubmit={() => setAppliedRange({ min, max })}
      />

      <div className="cards-grid">
        {solutions.length ? (
          solutions.map((solution) => (
            <SolutionCard key={solution.id} {...solution} />
          ))
        ) : (
          <p className="empty">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
};

export default SolutionsGridPage;
