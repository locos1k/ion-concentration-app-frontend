import { useState } from 'react';
import type { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import type { Solution } from '../modules/solution.model.ts';
import { DEFAULT_IMAGE_URL } from '../modules/solutions.media.ts';

type Props = Pick<
  Solution,
  'id' | 'substanceName' | 'imageUrl' | 'likesCount' | 'molarConcentration' | 'isCreator'
> & {
  canDelete?: boolean;
  disabled?: boolean;
  onDelete?: (id: number) => void;
};

export const SolutionCard: FC<Props> = ({
  id,
  substanceName,
  imageUrl,
  likesCount,
  molarConcentration,
  isCreator,
  canDelete = false,
  disabled = false,
  onDelete,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card className="solution-card">
      <Link to={`${ROUTES.FEED}/${id}`} className="solution-card__link">
        <Card.Img
          className="solution-card__image"
          src={imageFailed || !imageUrl ? DEFAULT_IMAGE_URL : imageUrl}
          alt={substanceName}
          onError={() => setImageFailed(true)}
        />
        <p className="solution-card__title">{substanceName}</p>
        <p className="solution-card__likes">
          <img
            className="solution-card__like-icon"
            src="/img/solution-like-icon.png"
            alt="Лайки"
          />
          {likesCount}
        </p>
        <p className="solution-card__field">
          Молярная концентрация: {molarConcentration} моль/л
        </p>
      </Link>
      {canDelete && isCreator === 1 && (
        <Button
          type="button"
          className="solution-card__delete"
          disabled={disabled}
          onClick={() => onDelete?.(id)}
        >
          Удалить
        </Button>
      )}
    </Card>
  );
};
