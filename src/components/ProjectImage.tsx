import type { LucideIcon } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { BRAND_GRADIENT } from '../constants';
import type { ProjectImage as ProjectImageData } from '../data/projects';

type ProjectImageProps = {
  image: ProjectImageData;
  icon: LucideIcon;
  className?: string;
  style?: CSSProperties;
};

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

/** Tries the local screenshot, then the remote placeholder, then a gradient tile with the project icon. */
export default function ProjectImage({ image, icon: Icon, className = '', style }: ProjectImageProps) {
  const sources = [image.src, image.placeholder];
  const [attempt, setAttempt] = useState(0);

  if (attempt >= sources.length) {
    return (
      <div role="img" aria-label={image.alt} className={`relative overflow-hidden ${RADIUS} ${className}`} style={style}>
        <div className="absolute inset-0 opacity-40" style={{ background: BRAND_GRADIENT }} />
        <div className="relative flex h-full w-full items-center justify-center">
          <Icon aria-hidden="true" size={56} strokeWidth={1.5} color="#D7E2EA" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={sources[attempt]}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      onError={() => setAttempt((a) => a + 1)}
      className={`object-cover ${RADIUS} ${className}`}
      style={style}
    />
  );
}
