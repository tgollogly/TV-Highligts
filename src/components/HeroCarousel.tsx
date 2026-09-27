import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { TvShow } from '../../server/epgService';
import { ProgrammeImage } from './ProgrammeImage';

type Props = { shows: TvShow[] };

export function HeroCarousel({ shows }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [shows]);

  useEffect(() => {
    if (shows.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % shows.length), 6000);
    return () => window.clearInterval(id);
  }, [shows.length]);

  if (!shows.length) {
    return <div className="panel empty">No prime-time highlights yet — check back after 5pm.</div>;
  }

  const safeIndex = Math.min(index, shows.length - 1);
  const show = shows[safeIndex];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + shows.length) % shows.length);
  };

  return (
    <section className="hero-carousel panel" aria-label="Tonight's featured shows">
      <div className="carousel-toolbar">
        <p className="eyebrow">Tonight&apos;s spotlight</p>
        {shows.length > 1 && (
          <div className="carousel-nav">
            <button type="button" className="ghost-btn" onClick={() => go(-1)} aria-label="Previous slide">
              ‹
            </button>
            <span>{safeIndex + 1} / {shows.length}</span>
            <button type="button" className="ghost-btn" onClick={() => go(1)} aria-label="Next slide">
              ›
            </button>
          </div>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={show.id}
          className="hero-slide"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-copy">
            <h2>{show.title}</h2>
            <p className="hero-desc">{show.description}</p>
            <div className="hero-foot">
              <span>{show.channelName}</span>
              <span>
                {new Date(show.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="score-chip">Score {show.score}</span>
            </div>
          </div>
          <div className="hero-art">
            <ProgrammeImage
              src={show.image}
              fallbackSrc={show.channelLogo}
              title={show.title}
              className="hero-art-img"
            />
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="carousel-dots" role="tablist" aria-label="Carousel slides">
        {shows.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            className={i === safeIndex ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
          />
        ))}
      </div>
    </section>
  );
}
