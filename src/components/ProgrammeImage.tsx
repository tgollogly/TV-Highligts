import { useState } from 'react';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export function ProgrammeImage({ src, alt = '', className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`programme-image-fallback ${className ?? ''}`} aria-hidden />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
