import { motion } from 'framer-motion';
import type { TvShow } from '../../server/epgService';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

type Props = {
  show: TvShow;
  rank?: number;
  compact?: boolean;
};

export function ShowCard({ show, rank, compact }: Props) {
  return (
    <motion.article
      className={`show-card ${compact ? 'compact' : ''}`}
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <div className="show-card-media">
        {show.image ? (
          <img src={show.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="show-card-fallback" />
        )}
        {rank != null && <span className="show-rank">#{rank}</span>}
        <span className="show-score">{show.score}</span>
      </div>
      <div className="show-card-body">
        <div className="show-meta">
          <span className="channel-pill">{show.channelName}</span>
          <time dateTime={show.start}>
            {formatTime(show.start)} – {formatTime(show.stop)}
          </time>
        </div>
        <h3>{show.title}</h3>
        {!compact && <p>{show.description || 'No description available.'}</p>}
        {show.tags.length > 0 && (
          <ul className="tag-row">
            {show.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}
