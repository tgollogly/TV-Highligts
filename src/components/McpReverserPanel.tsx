import { motion } from 'framer-motion';
import { MCP_GUARDRAILS, SITE } from '../config';
import type { TonightPayload } from '../../server/epgService';

type Props = {
  payload: TonightPayload | null;
  apiLatencyMs: number | null;
};

export function McpReverserPanel({ payload, apiLatencyMs }: Props) {
  return (
    <aside className="mcp-panel panel" aria-label="MCP reverser dashboard for frontend design team">
      <header className="mcp-header">
        <div>
          <p className="eyebrow">Reverser UI · MCP</p>
          <h2>Design guardrails & compliance</h2>
        </div>
        <span className="mcp-badge">ZenWallet → TV Zen</span>
      </header>
      <p className="mcp-intro">
        Engineering snapshot for the frontend team: fluid CryptoZen-style motion, reversed onto a personal LG-friendly
        &quot;what&apos;s on TV&quot; surface with explicit data provenance.
      </p>
      <ul className="guardrail-list">
        {MCP_GUARDRAILS.map((g, i) => (
          <motion.li
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className={`status ${g.status}`}>{g.status}</span>
            <div>
              <strong>{g.label}</strong>
              <p>{g.detail}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      <dl className="mcp-stats">
        <div>
          <dt>EPG shows (tonight)</dt>
          <dd>{payload?.rankings.length ?? '—'}</dd>
        </div>
        <div>
          <dt>Watchlist hits</dt>
          <dd>{payload?.watchlist.length ?? '—'}</dd>
        </div>
        <div>
          <dt>Stormont / NI</dt>
          <dd>{payload?.stormont.length ?? '—'}</dd>
        </div>
        <div>
          <dt>API latency</dt>
          <dd>{apiLatencyMs != null ? `${apiLatencyMs}ms` : '—'}</dd>
        </div>
      </dl>
      <footer className="mcp-footer">
        <code>owner: {SITE.owner}</code>
        <code>build: vite + framer-motion</code>
      </footer>
    </aside>
  );
}
