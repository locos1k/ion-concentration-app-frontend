import { useEffect } from 'react';
import type { FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import { SolutionDescription } from '../components/SolutionDescription.tsx';
import { SolutionVideo } from '../components/SolutionVideo.tsx';
import { selectIsLoading, useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { fetchSolutionFeed, likeSolution } from '../store/thunks/solutions.thunks.ts';

const SolutionsFeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { solution, notFound } = useAppSelector((state) => state.feed);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if ((location.state as { fresh?: boolean } | null)?.fresh) return;
    void dispatch(fetchSolutionFeed({ id: id === undefined ? undefined : Number(id) }));
  }, [dispatch, id, isAuthenticated, location.state]);

  useEffect(() => {
    document.title = solution?.substanceName ?? 'Лента';
    return () => {
      document.title = 'Растворы электролитов';
    };
  }, [solution]);

  const handleNext = async () => {
    if (!solution) return;
    const next = await dispatch(fetchSolutionFeed({ id: solution.id, next: true }));
    if (fetchSolutionFeed.fulfilled.match(next)) {
      navigate(`${ROUTES.FEED}/${next.payload.id}`, { state: { fresh: true } });
    }
  };

  const handleLike = () => {
    if (!solution) return;
    void dispatch(likeSolution({ id: solution.id, value: solution.isLiked === 1 ? 0 : 1 }));
  };

  if (!solution) {
    return (
      <div className="page-body feed-screen">
        {notFound && !isLoading && <p className="empty">Раствор не найден</p>}
      </div>
    );
  }

  return (
    <div className="page-body feed-screen">
      <div className="media-wrap">
        <SolutionVideo key={solution.id} src={solution.videoUrl} />

        <div className="side-actions">
          {isAuthenticated ? (
            <button
              type="button"
              className={`like-btn like-btn--active${solution.isLiked === 1 ? ' liked' : ''}`}
              aria-label={solution.isLiked === 1 ? 'Убрать лайк' : 'Поставить лайк'}
              aria-pressed={solution.isLiked === 1}
              disabled={isLoading}
              onClick={handleLike}
            >
              <img className="like-icon" src="/img/solution-like-icon.png" alt="Лайки" />
              <span>{solution.likesCount}</span>
            </button>
          ) : (
            <div className="like-btn">
              <img className="like-icon" src="/img/solution-like-icon.png" alt="Лайки" />
              <span>{solution.likesCount}</span>
            </div>
          )}

          <button
            type="button"
            className="next-btn"
            aria-label="Следующий"
            disabled={isLoading}
            onClick={handleNext}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              style={{ transform: 'rotate(90deg)' }}
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="field-badge" aria-label="pH">
            <span className="field-badge__label">pH</span>
            <span className="field-badge__value">{solution.ph}</span>
          </div>

          <div className="field-badge" aria-label="Молярная концентрация">
            <span className="field-badge__label">моль/л</span>
            <span className="field-badge__value">{solution.molarConcentration}</span>
          </div>
        </div>

        <div className="info-overlay">
          <div className="info-text">
            <h1 className="title">{solution.substanceName}</h1>
            <SolutionDescription key={solution.id} text={solution.description} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsFeedPage;
