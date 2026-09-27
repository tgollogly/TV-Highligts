export const SITE = {
  name: 'TV Zen',
  tagline: 'CryptoZen-inspired fluid dashboard — reversed for free-to-air UK TV',
  owner: import.meta.env.VITE_OWNER_NAME ?? 'Cursor Agent',
  year: new Date().getFullYear(),
};

export const REGIONS = [
  { id: 'london', label: 'London' },
  { id: 'ni', label: 'Northern Ireland' },
  { id: 'scotland', label: 'Scotland' },
  { id: 'wales', label: 'Wales' },
  { id: 'northwest', label: 'North West' },
  { id: 'yorkshire', label: 'Yorkshire' },
] as const;

export type RegionId = (typeof REGIONS)[number]['id'];

export const MCP_GUARDRAILS = [
  { id: 'attribution', label: 'EPG attribution', status: 'pass', detail: 'Freeview-EPG source linked in footer & MCP panel.' },
  { id: 'cookies', label: 'Cookie consent', status: 'pass', detail: 'Essential localStorage only; no third-party trackers.' },
  { id: 'pii', label: 'PII minimisation', status: 'pass', detail: 'No accounts, no analytics beacons in default build.' },
  { id: 'a11y', label: 'Motion & contrast', status: 'warn', detail: 'Respects prefers-reduced-motion; verify on LG webOS browser.' },
  { id: 'rate', label: 'API rate guard', status: 'pass', detail: 'EPG cached 30m server-side / static JSON at build.' },
  { id: 'legal', label: 'Personal use disclaimer', status: 'pass', detail: 'Not affiliated with BBC, ITV, Channel 4 or LG.' },
] as const;
