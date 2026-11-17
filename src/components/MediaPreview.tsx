import { useState } from 'react';
import type { FC } from 'react';
import { DEFAULT_IMAGE_URL, DEFAULT_VIDEO_URL } from '../modules/solutions.media.ts';

interface Props {
  kind: 'image' | 'video';
  src: string | null;
}

export const MediaPreview: FC<Props> = ({ kind, src }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fallback = kind === 'image' ? DEFAULT_IMAGE_URL : DEFAULT_VIDEO_URL;
  const url = !src || failedSrc === src ? fallback : src;

  return kind === 'image' ? (
    <img
      className="preview-media"
      src={url}
      alt="Изображение раствора"
      onError={() => setFailedSrc(src)}
    />
  ) : (
    <video
      key={url}
      className="preview-media"
      src={url}
      muted
      loop
      playsInline
      controls
      onError={() => setFailedSrc(src)}
    />
  );
};
