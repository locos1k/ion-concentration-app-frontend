import { useEffect } from 'react';
import type { FC } from 'react';
import { SolutionCard } from '../components/SolutionCard.tsx';
import { SolutionsFilter } from '../components/SolutionsFilter.tsx';
import { selectIsLoading, useAppDispatch, useAppSelector, useAppStore } from '../store/hooks.ts';
import { setMax, setMin } from '../store/slices/solutionsSlice.ts';
import { deleteSolution, fetchSolutions } from '../store/thunks/solutions.thunks.ts';

const SolutionsGridPage: FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { cards, min, max, loaded } = useAppSelector((state) => state.solutions);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    // при открытии страницы и смене состояния гость/создатель берём сохранённый фильтр из store
    const { min: savedMin, max: savedMax } = store.getState().solutions;
    void dispatch(fetchSolutions({ min: savedMin, max: savedMax }));
  }, [dispatch, store, isAuthenticated]);

  return (
    <div className="page-body grid-screen">
      <h1 className="title">Каталог растворов</h1>

      <SolutionsFilter
        min={min}
        max={max}
        setMin={(value) => dispatch(setMin(value))}
        setMax={(value) => dispatch(setMax(value))}
        onSubmit={() => void dispatch(fetchSolutions({ min, max }))}
        disabled={isLoading}
      />

      <div className="cards-grid">
        {cards.length ? (
          cards.map((solution) => (
            <SolutionCard
              key={solution.id}
              {...solution}
              canDelete={isAuthenticated}
              disabled={isLoading}
              onDelete={(id) => void dispatch(deleteSolution(id))}
            />
          ))
        ) : (
          loaded && <p className="empty">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
};

export default SolutionsGridPage;
