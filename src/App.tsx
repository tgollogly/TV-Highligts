import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CookieNotice } from './components/CookieNotice';
import { HalloweenBackground } from './components/HalloweenBackground';
import { HeroCarousel } from './components/HeroCarousel';
import { LegalFooter } from './components/LegalFooter';
import { McpReverserPanel } from './components/McpReverserPanel';
import { ShowCard } from './components/ShowCard';
import { OnDemandSection } from './components/OnDemandSection';
import { DEFAULT_REGION, REGIONS, SITE, type RegionId } from './config';
import { useTonight } from './hooks/useTonight';
import './styles/app.css';

const REGION_KEY = 'tvzen-region';

export default function App() {
  const [region, setRegion] = useState<RegionId>(() => {
    const saved = localStorage.getItem(REGION_KEY) as RegionId | null;
    return saved && REGIONS.some((r) => r.id === saved) ? saved : DEFAULT_REGION;
  });
  const [latency, setLatency] = useState<number | null>(null);
  const { data, loading, error, reload } = useTonight(region);

  useEffect(() => {
    localStorage.setItem(REGION_KEY, region);
  }, [region]);

  useEffect(() => {
    const t0 = performance.now();
    if (!loading && data) setLatency(Math.round(performance.now() - t0));
  }, [loading, data]);

  return (
    <div className="app-shell">
      <HalloweenBackground />
      <CookieNotice />

      <header className="site-header">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="brand">
          <span className="brand-icon" aria-hidden>🎃</span>
          <div>
            <h1>{SITE.name}</h1>
            <p>{SITE.tagline}</p>
          </div>
        </motion.div>
        <div className="header-actions">
          <label className="region-select">
            <span>Region</span>
            <select value={region} onChange={(e) => setRegion(e.target.value as RegionId)}>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </label>
          <button type="button" className="ghost-btn" onClick={() => void reload()} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      <main className="layout">
        {loading && <p className="status-banner">Summoning tonight&apos;s listings…</p>}
        {error && (
          <p className="status-banner error" role="alert">
            {error}
          </p>
        )}

        {data && (
          <>
            <section className="intro panel">
              <h2>Tonight on free-to-air & LG Smart TV</h2>
              <p>
                Prime-time rankings for <strong>{data.region}</strong> ({new Date(data.primeWindow.from).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}).
                Prioritising <em>on-demand</em> on BBC iPlayer &amp; ITVX, <em>Coronation Street</em>, <em>Emmerdale</em>, <em>Midsomer Murders</em>, mystery thrillers, and Stormont coverage.
              </p>
            </section>

            <OnDemandSection data={data} />

            <div className="grid-top">
              <HeroCarousel shows={data.carousel} />
              <McpReverserPanel payload={data} apiLatencyMs={latency} />
            </div>

            <section className="panel section">
              <header className="section-head">
                <h2>Watchlist radar</h2>
                <p>Soaps, Stormont & flagged favourites</p>
              </header>
              {data.watchlist.length === 0 ? (
                <p className="muted">No watchlist matches in this window — try another region or refresh after 5pm.</p>
              ) : (
                <div className="card-grid">
                  {data.watchlist.map((s) => (
                    <ShowCard key={s.id} show={s} compact />
                  ))}
                </div>
              )}
            </section>

            <section className="panel section">
              <header className="section-head">
                <h2>Tonight&apos;s rankings</h2>
                <p>Scored for prime-time appeal & your thriller/soaps profile</p>
              </header>
              <div className="rank-list">
                {data.rankings.map((s, i) => (
                  <ShowCard key={s.id} show={s} rank={i + 1} compact={i > 5} />
                ))}
              </div>
            </section>

            <section className="panel section">
              <header className="section-head">
                <h2>Mystery &amp; thriller lane — linear TV</h2>
                <p>Tonight on BBC, UTV &amp; ITV — pair with the on-demand section above</p>
              </header>
              <div className="card-grid">
                {(data.mysteryThrillers.length ? data.mysteryThrillers : data.rankings.filter((s) => s.tags.includes('mystery') || s.tags.includes('thriller'))).slice(0, 12).map((s) => (
                  <ShowCard key={s.id} show={s} compact />
                ))}
              </div>
            </section>

            {data.stormont.length > 0 && (
              <section className="panel section stormont">
                <header className="section-head">
                  <h2>Stormont & NI politics</h2>
                  <p>The View from Stormont & assembly coverage</p>
                </header>
                <div className="card-grid">
                  {data.stormont.map((s) => (
                    <ShowCard key={s.id} show={s} />
                  ))}
                </div>
              </section>
            )}

            <section className="panel section">
              <header className="section-head">
                <h2>Channel schedules</h2>
                <p>Evening timeline — ideal for LG remote browsing</p>
              </header>
              <div className="schedule-grid">
                {Object.entries(data.scheduleByChannel).map(([channel, items]) => (
                  <div key={channel} className="schedule-col">
                    <h3>{channel}</h3>
                    <ul>
                      {items.map((s) => (
                        <li key={s.id}>
                          <time dateTime={s.start}>
                            {new Date(s.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </time>
                          <span>{s.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <LegalFooter payload={data} />
    </div>
  );
}
