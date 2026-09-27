export const SITE = {
  name: 'TV Zen',
  tagline: 'Northern Ireland tonight · on-demand & free-to-air rankings',
  owner: import.meta.env.VITE_OWNER_NAME ?? 'Thomas Gollogly',
  url: import.meta.env.VITE_SITE_URL ?? 'https://tonight.tgollogly.dev',
  year: new Date().getFullYear(),
};

export const REGIONS = [
  { id: 'ni', label: 'Northern Ireland' },
  { id: 'london', label: 'London' },
  { id: 'scotland', label: 'Scotland' },
  { id: 'wales', label: 'Wales' },
  { id: 'northwest', label: 'North West' },
  { id: 'yorkshire', label: 'Yorkshire' },
] as const;

export type RegionId = (typeof REGIONS)[number]['id'];

export const DEFAULT_REGION: RegionId = 'ni';

export const MCP_GUARDRAILS = [
  { id: 'attribution', label: 'EPG attribution', status: 'pass', detail: 'Freeview-EPG source linked in footer & MCP panel.' },
  { id: 'cookies', label: 'Cookie consent', status: 'pass', detail: 'Essential localStorage only; no third-party trackers.' },
  { id: 'pii', label: 'PII minimisation', status: 'pass', detail: 'No accounts, no analytics beacons in default build.' },
  { id: 'a11y', label: 'Motion & contrast', status: 'warn', detail: 'Respects prefers-reduced-motion; verify on LG webOS & iPhone.' },
  { id: 'rate', label: 'API rate guard', status: 'pass', detail: 'EPG cached 30m server-side / static JSON at build.' },
  { id: 'legal', label: 'Personal use disclaimer', status: 'pass', detail: 'MIT licensed © Thomas Gollogly — see LEGAL.md.' },
] as const;
