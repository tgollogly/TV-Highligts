import type { TvShow } from './epgService';

export type OnDemandPick = {
  id: string;
  title: string;
  platform: 'BBC iPlayer' | 'ITVX' | 'Channel 4' | 'My5';
  description: string;
  url: string;
  image?: string;
  tags: string[];
  availability: 'watch-now' | 'catch-up-soon' | 'hub';
};

const NI_HUBS: OnDemandPick[] = [
  {
    id: 'hub-bbc-ni',
    title: 'BBC iPlayer — Northern Ireland',
    platform: 'BBC iPlayer',
    description: 'Regional BBC One NI, news, Stormont specials, and national drama box sets.',
    url: 'https://www.bbc.co.uk/iplayer/guide/bbcone/northernireland',
    tags: ['ni', 'hub', 'stormont'],
    availability: 'hub',
  },
  {
    id: 'hub-itvx',
    title: 'ITVX — UTV & ITV drama',
    platform: 'ITVX',
    description: 'Coronation Street, Emmerdale, and ITV crime dramas on demand.',
    url: 'https://www.itv.com/watch/categories/drama-and-soaps',
    tags: ['ni', 'hub', 'soap'],
    availability: 'hub',
  },
  {
    id: 'hub-bbc-crime',
    title: 'BBC iPlayer — Crime & Thriller',
    platform: 'BBC iPlayer',
    description: 'Mystery, detective & thriller collections including Vera, Shetland, Silent Witness.',
    url: 'https://www.bbc.co.uk/iplayer/categories/crime-and-thriller',
    tags: ['mystery', 'thriller', 'hub'],
    availability: 'hub',
  },
  {
    id: 'hub-c4',
    title: 'Channel 4 — Drama',
    platform: 'Channel 4',
    description: 'Acclaimed drama and true crime on All 4.',
    url: 'https://www.channel4.com/categories/drama',
    tags: ['mystery', 'hub'],
    availability: 'hub',
  },
];

const CURATED_MYSTERY: OnDemandPick[] = [
  {
    id: 'midsomer',
    title: 'Midsomer Murders',
    platform: 'ITVX',
    description: 'Classic English village whodunits — perfect Halloween binge.',
    url: 'https://www.itv.com/watch?keyword=midsomer%20murders',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'vera',
    title: 'Vera',
    platform: 'ITVX',
    description: 'North East detective drama — bleak coastlines and slow-burn mysteries.',
    url: 'https://www.itv.com/watch?keyword=vera',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'shetland',
    title: 'Shetland',
    platform: 'BBC iPlayer',
    description: 'Island noir investigations — strong BBC iPlayer catalogue.',
    url: 'https://www.bbc.co.uk/iplayer/search?q=shetland',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'silent-witness',
    title: 'Silent Witness',
    platform: 'BBC iPlayer',
    description: 'Forensic pathology crime drama — frequent BBC repeats and catch-up.',
    url: 'https://www.bbc.co.uk/iplayer/search?q=silent%20witness',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'line-of-duty',
    title: 'Line of Duty',
    platform: 'BBC iPlayer',
    description: 'Police anti-corruption thriller — AC-12 investigations.',
    url: 'https://www.bbc.co.uk/iplayer/search?q=line%20of%20duty',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'unforgotten',
    title: 'Unforgotten',
    platform: 'ITVX',
    description: 'Cold-case detective drama with emotional twists.',
    url: 'https://www.itv.com/watch?keyword=unforgotten',
    tags: ['mystery', 'thriller', 'watchlist'],
    availability: 'watch-now',
  },
  {
    id: 'stormont',
    title: 'BBC Parliament / NI politics',
    platform: 'BBC iPlayer',
    description: 'Stormont coverage, Executive Office Questions, and The View from Stormont.',
    url: 'https://www.bbc.co.uk/iplayer/search?q=stormont',
    tags: ['stormont', 'ni', 'news'],
    availability: 'watch-now',
  },
];

function platformForChannel(channelName: string): OnDemandPick['platform'] {
  const n = channelName.toLowerCase();
  if (n.includes('bbc')) return 'BBC iPlayer';
  if (n.includes('itv') || n.includes('utv')) return 'ITVX';
  if (n.includes('channel 4') || n.includes('e4')) return 'Channel 4';
  if (n.includes('5')) return 'My5';
  return 'BBC iPlayer';
}

function watchUrl(title: string, platform: OnDemandPick['platform']): string {
  const q = encodeURIComponent(title);
  switch (platform) {
    case 'ITVX':
      return `https://www.itv.com/watch?keyword=${q}`;
    case 'Channel 4':
      return `https://www.channel4.com/search?q=${q}`;
    case 'My5':
      return `https://www.channel5.com/search?q=${q}`;
    default:
      return `https://www.bbc.co.uk/iplayer/search?q=${q}`;
  }
}

export function buildOnDemandFromLinear(shows: TvShow[], regionKey: string): OnDemandPick[] {
  if (regionKey !== 'ni') {
    return [];
  }

  const picks: OnDemandPick[] = [];
  const seen = new Set<string>();

  for (const show of shows) {
    const isRelevant =
      show.tags.includes('mystery') ||
      show.tags.includes('watchlist') ||
      show.tags.includes('stormont') ||
      show.tags.includes('soap') ||
      show.tags.includes('drama');
    if (!isRelevant) continue;

    const key = show.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const platform = platformForChannel(show.channelName);
    picks.push({
      id: `linear-${show.id}`,
      title: show.title,
      platform,
      description: `Catch-up after tonight's ${show.channelName} broadcast — open ${platform}.`,
      url: watchUrl(show.title, platform),
      image: show.image,
      tags: [...show.tags, 'on-demand'],
      availability: 'catch-up-soon',
    });
  }

  return picks.slice(0, 16);
}

export function getNiOnDemandPayload(linearShows: TvShow[], regionKey: string) {
  const fromLinear = buildOnDemandFromLinear(linearShows, regionKey);
  const mysteryThrillers = [...CURATED_MYSTERY, ...fromLinear.filter((p) => p.tags.includes('mystery'))].slice(0, 20);
  const soapsAndNi = fromLinear.filter((p) => p.tags.includes('soap') || p.tags.includes('stormont'));

  return {
    region: 'Northern Ireland',
    hubs: regionKey === 'ni' ? NI_HUBS : [],
    curatedMystery: regionKey === 'ni' ? CURATED_MYSTERY : [],
    fromTonightLinear: fromLinear,
    mysteryOnDemand: mysteryThrillers,
    niSoapsAndPolitics: soapsAndNi,
  };
}
