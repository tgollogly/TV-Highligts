import { useState } from 'react';

type Props = {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  title?: string;
};

export function ProgrammeImage({ src, fallbackSrc, alt = '', className, title }: Props) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'none'>('primary');

  const activeSrc =
    stage === 'primary' ? src : stage === 'fallback' ? fallbackSrc : undefined;

  if (!activeSrc || stage === 'none') {
    return (
      <div className={`programme-image-fallback ${className ?? ''}`} aria-hidden>
        {title ? <span className="programme-image-initial">{title.charAt(0)}</span> : null}
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (stage === 'primary' && fallbackSrc) setStage('fallback');
        else setStage('none');
      }}
    />
  );
}
