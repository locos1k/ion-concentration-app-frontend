import { useState } from 'react';
import type { FC } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import type { Solution } from '../modules/solution.model.ts';
import { DEFAULT_IMAGE_URL } from '../modules/solutions.media.ts';

type Props = Pick<
  Solution,
  'id' | 'substanceName' | 'imageUrl' | 'likesCount' | 'molarConcentration'
>;

export const SolutionCard: FC<Props> = ({
  id,
  substanceName,
  imageUrl,
  likesCount,
  molarConcentration,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card as={Link} to={`${ROUTES.FEED}/${id}`} className="solution-card">
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
    </Card>
  );
};
