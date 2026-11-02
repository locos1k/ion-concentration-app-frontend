import { useState } from 'react';
import type { FC } from 'react';
import { DEFAULT_VIDEO_URL } from '../modules/solutions.media.ts';

interface Props {
  src: string | null;
}

export const SolutionVideo: FC<Props> = ({ src }) => {
  const [failed, setFailed] = useState(false);

  return (
    <video
      className="media"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      key={failed ? 'default' : 'own'}
    >
      <source
        src={failed || !src ? DEFAULT_VIDEO_URL : src}
        onError={() => setFailed(true)}
      />
    </video>
  );
};
