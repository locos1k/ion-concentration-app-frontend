import { useState } from 'react';
import type { FC } from 'react';

const DESCRIPTION_HEAD = 65;

const splitDescription = (text: string): [string, string] => {
  if (text.length <= DESCRIPTION_HEAD) return [text, ''];
  let cut = text.lastIndexOf(' ', DESCRIPTION_HEAD);
  if (cut < DESCRIPTION_HEAD * 0.6) cut = DESCRIPTION_HEAD;
  return [text.slice(0, cut), text.slice(cut)];
};

interface Props {
  text: string;
}

export const SolutionDescription: FC<Props> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [head, rest] = splitDescription(text);

  return (
    <div className="description">
      {head}
      {rest && (
        <>
          {expanded && rest}{' '}
          <button
            type="button"
            className="desc-toggle"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Свернуть' : 'Ещё'}
          </button>
        </>
      )}
    </div>
  );
};
