import { useEffect } from 'react';
import type { FC } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import type { SolutionsOutletContext } from '../SolutionsLayout.tsx';
import { SolutionVideo } from '../components/SolutionVideo.tsx';
import { SolutionDescription } from '../components/SolutionDescription.tsx';
import { SOLUTIONS_MOCK } from '../modules/solutions.mock.ts';

const SolutionsFeedPage: FC = () => {
  const { id } = useParams();
  const { cards } = useOutletContext<SolutionsOutletContext>();

  const list = cards.length ? cards : SOLUTIONS_MOCK;
  const solution = id
    ? (list.find((item) => String(item.id) === id) ??
      SOLUTIONS_MOCK.find((item) => String(item.id) === id))
    : list[0];

  const currentIndex = solution
    ? list.findIndex((item) => item.id === solution.id)
    : -1;
  const nextSolution = list[(currentIndex + 1) % list.length];

  useEffect(() => {
    document.title = solution?.substanceName ?? 'Лента';
    return () => {
      document.title = 'Растворы электролитов';
    };
  }, [solution]);

  if (!solution) {
    return (
      <div className="page-body feed-screen">
        <p className="empty">Раствор не найден</p>
      </div>
    );
  }

  return (
    <div className="page-body feed-screen">
      <div className="media-wrap">
        <SolutionVideo key={solution.id} src={solution.videoUrl} />

        <div className="side-actions">
          <div className="like-btn">
            <img
              className="like-icon"
              src="/img/solution-like-icon.png"
              alt="Лайки"
            />
            <span>{solution.likesCount}</span>
          </div>

          <Link
            className="next-btn"
            to={`${ROUTES.FEED}/${nextSolution.id}`}
            aria-label="Следующий"
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
          </Link>

          <div className="field-badge" aria-label="pH">
            <span className="field-badge__label">pH</span>
            <span className="field-badge__value">{solution.ph}</span>
          </div>

          <div className="field-badge" aria-label="Молярная концентрация">
            <span className="field-badge__label">моль/л</span>
            <span className="field-badge__value">
              {solution.molarConcentration}
            </span>
          </div>
        </div>

        <div className="info-overlay">
          <div className="info-text">
            <h1 className="title">{solution.substanceName}</h1>
            <SolutionDescription
              key={solution.id}
              text={solution.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsFeedPage;
