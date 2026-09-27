import { XMLParser } from 'fast-xml-parser';

const EPG_URL = 'https://raw.githubusercontent.com/dp247/Freeview-EPG/master/epg.xml';

export type TvShow = {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelName: string;
  channelLogo?: string;
  start: string;
  stop: string;
  image?: string;
  score: number;
  tags: string[];
  isWatchlist: boolean;
};

export type TonightPayload = {
  generatedAt: string;
  region: string;
  primeWindow: { from: string; to: string };
  carousel: TvShow[];
  rankings: TvShow[];
  watchlist: TvShow[];
  scheduleByChannel: Record<string, TvShow[]>;
  stormont: TvShow[];
  mysteryThrillers: TvShow[];
  sources: { name: string; url: string; license: string }[];
  compliance: {
    dataRetentionHours: number;
    attributionRequired: true;
    personalUseOnly: true;
  };
};

const REGION_CHANNELS: Record<string, { bbc: string; itv: string; label: string }> = {
  london: { bbc: 'BBCOneLondonHD.uk', itv: 'ITV1London.uk', label: 'London' },
  ni: { bbc: 'BBCOneNorthernIreland.uk', itv: 'UTV.uk', label: 'Northern Ireland' },
  scotland: { bbc: 'BBCOneScotHD.uk', itv: 'STVCentral.uk', label: 'Scotland' },
  wales: { bbc: 'BBCOneWalesHD.uk', itv: 'ITV1Wales.uk', label: 'Wales' },
  northwest: { bbc: 'BBCOneNorthWest.uk', itv: 'ITV1Granada.uk', label: 'North West' },
  yorkshire: { bbc: 'BBCOneYorkshire.uk', itv: 'ITV1YorkshireEast.uk', label: 'Yorkshire' },
};

const EXTRA_CHANNELS = [
  'BBCTwoHD.uk',
  'BBCFourHD.uk',
  'BBCThreeHD.uk',
  'ITV2.uk',
  'ITV3.uk',
  'Channel4London.uk',
  '5.uk',
  'BBCParliament.uk',
  'BBCNews.uk',
];

const WATCHLIST_TITLES = [
  'coronation street',
  'emmerdale',
  'midsomer murders',
  'vera',
  'shetland',
  'line of duty',
  'silent witness',
  'unforgotten',
  'the view from stormont',
  'stormont',
  'executive office questions',
  'holby city',
  'casualty',
  'eastenders',
];

const MYSTERY_KEYWORDS = [
  'murder',
  'mystery',
  'thriller',
  'detective',
  'crime',
  'suspense',
  'whodunit',
  'investigation',
  'noir',
];

let cache: { fetchedAt: number; xml: string } | null = null;
const CACHE_MS = 30 * 60 * 1000;

async function fetchEpgXml(): Promise<string> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_MS) {
    return cache.xml;
  }
  const res = await fetch(EPG_URL, { headers: { 'User-Agent': 'TVZenDashboard/1.0 (personal use)' } });
  if (!res.ok) throw new Error(`EPG fetch failed: ${res.status}`);
  const xml = await res.text();
  cache = { fetchedAt: now, xml };
  return xml;
}

type RawChannel = { '@_id': string; 'display-name': string | string[]; icon?: { '@_src': string } };
type RawProgramme = {
  '@_channel': string;
  '@_start': string;
  '@_stop': string;
  title?: string | { '#text': string };
  desc?: string | { '#text': string };
  icon?: { '@_src': string } | Array<{ '@_src': string }>;
};

function textField(v: string | { '#text': string } | undefined): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v['#text'] ?? '';
}

function parseXmltvTime(raw: string): Date {
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!m) return new Date(NaN);
  const [, y, mo, d, h, mi, s] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}`);
}

function isTonight(start: Date, end: Date, night: Date): boolean {
  const evening = new Date(night);
  evening.setHours(17, 0, 0, 0);
  const cutoff = new Date(night);
  cutoff.setDate(cutoff.getDate() + 1);
  cutoff.setHours(6, 0, 0, 0);
  return start < cutoff && end > evening;
}

function scoreShow(title: string, desc: string, start: Date): { score: number; tags: string[]; isWatchlist: boolean } {
  const hay = `${title} ${desc}`.toLowerCase();
  let score = 40;
  const tags: string[] = [];

  for (const w of WATCHLIST_TITLES) {
    if (hay.includes(w)) {
      score += 35;
      tags.push('watchlist');
      if (w.includes('stormont')) tags.push('stormont');
      if (w.includes('coronation') || w.includes('emmerdale') || w.includes('eastenders')) tags.push('soap');
      if (w.includes('midsomer') || w.includes('vera') || w.includes('shetland')) tags.push('drama');
    }
  }

  for (const k of MYSTERY_KEYWORDS) {
    if (hay.includes(k)) {
      score += 12;
      if (!tags.includes('mystery')) tags.push('mystery');
    }
  }

  const hour = start.getHours();
  if (hour >= 18 && hour <= 22) score += 15;
  if (hour >= 20 && hour <= 21) score += 10;

  if (hay.includes('news')) score -= 5;
  if (hay.includes('teleshopping') || hay.includes('shop on tv')) score -= 40;

  const isWatchlist = tags.includes('watchlist') || tags.includes('soap') || tags.includes('stormont');

  return { score, tags, isWatchlist };
}

function programmeImage(icon: RawProgramme['icon']): string | undefined {
  if (!icon) return undefined;
  if (Array.isArray(icon)) return icon[0]?.['@_src'];
  return icon['@_src'];
}

export async function getTonightPayload(regionKey: string): Promise<TonightPayload> {
  const region = REGION_CHANNELS[regionKey] ?? REGION_CHANNELS.london;
  const channelIds = new Set([region.bbc, region.itv, ...EXTRA_CHANNELS]);

  const xml = await fetchEpgXml();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => name === 'channel' || name === 'programme' || name === 'icon',
  });
  const doc = parser.parse(xml) as { tv: { channel?: RawChannel[]; programme?: RawProgramme[] } };

  const channelMap = new Map<string, { name: string; logo?: string }>();
  for (const ch of doc.tv.channel ?? []) {
    const nameRaw = ch['display-name'];
    const name = Array.isArray(nameRaw) ? textField(nameRaw[0]) : textField(nameRaw);
    channelMap.set(ch['@_id'], { name, logo: ch.icon?.['@_src'] });
  }

  const tonight = new Date();
  tonight.setHours(0, 0, 0, 0);

  const shows: TvShow[] = [];

  for (const p of doc.tv.programme ?? []) {
    if (!channelIds.has(p['@_channel'])) continue;
    const start = parseXmltvTime(p['@_start']);
    const stop = parseXmltvTime(p['@_stop']);
    if (!isTonight(start, stop, tonight)) continue;

    const title = textField(p.title);
    const description = textField(p.desc);
    const meta = scoreShow(title, description, start);
    const ch = channelMap.get(p['@_channel']);

    shows.push({
      id: `${p['@_channel']}-${p['@_start']}`,
      title,
      description: description.slice(0, 280),
      channelId: p['@_channel'],
      channelName: ch?.name ?? p['@_channel'],
      channelLogo: ch?.logo,
      start: start.toISOString(),
      stop: stop.toISOString(),
      image: programmeImage(p.icon),
      score: meta.score,
      tags: meta.tags,
      isWatchlist: meta.isWatchlist,
    });
  }

  shows.sort((a, b) => b.score - a.score || new Date(a.start).getTime() - new Date(b.start).getTime());

  const scheduleByChannel: Record<string, TvShow[]> = {};
  for (const s of shows) {
    (scheduleByChannel[s.channelName] ??= []).push(s);
  }
  for (const key of Object.keys(scheduleByChannel)) {
    scheduleByChannel[key].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  const watchlist = shows.filter((s) => s.isWatchlist || s.tags.includes('watchlist'));
  const stormont = shows.filter((s) => s.tags.includes('stormont') || /stormont/i.test(`${s.title} ${s.description}`));
  const mysteryThrillers = shows.filter((s) => s.tags.includes('mystery') && s.score >= 50);

  const evening = new Date(tonight);
  evening.setHours(17, 0, 0, 0);
  const cutoff = new Date(tonight);
  cutoff.setDate(cutoff.getDate() + 1);
  cutoff.setHours(6, 0, 0, 0);

  return {
    generatedAt: new Date().toISOString(),
    region: region.label,
    primeWindow: { from: evening.toISOString(), to: cutoff.toISOString() },
    carousel: shows.slice(0, 8),
    rankings: shows.slice(0, 20),
    watchlist,
    scheduleByChannel,
    stormont,
    mysteryThrillers: mysteryThrillers.slice(0, 12),
    sources: [
      {
        name: 'Freeview-EPG (dp247)',
        url: EPG_URL,
        license: 'Community XMLTV; personal use; not affiliated with broadcasters.',
      },
    ],
    compliance: {
      dataRetentionHours: 168,
      attributionRequired: true,
      personalUseOnly: true,
    },
  };
}
