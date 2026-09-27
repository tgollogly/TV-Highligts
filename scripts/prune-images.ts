import type { TonightPayload, TvShow } from '../server/epgService';

const cache = new Map<string, boolean>();

async function imageReachable(url: string): Promise<boolean> {
  if (cache.has(url)) return cache.get(url)!;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0', 'User-Agent': 'TVZenBuild/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    const ok = res.ok || res.status === 206;
    cache.set(url, ok);
    return ok;
  } catch {
    cache.set(url, false);
    return false;
  }
}

async function pruneShow(show: TvShow): Promise<TvShow> {
  if (!show.image) return show;
  const ok = await imageReachable(show.image);
  if (ok) return show;
  return { ...show, image: undefined };
}

export async function prunePayloadImages(payload: TonightPayload): Promise<TonightPayload> {
  const pruneList = async (list: TvShow[]) => Promise.all(list.map(pruneShow));

  const rankings = await pruneList(payload.rankings);
  const carousel = await pruneList(payload.carousel);
  const watchlist = await pruneList(payload.watchlist);
  const mysteryThrillers = await pruneList(payload.mysteryThrillers);
  const stormont = await pruneList(payload.stormont);

  const scheduleByChannel: Record<string, TvShow[]> = {};
  for (const [ch, items] of Object.entries(payload.scheduleByChannel)) {
    scheduleByChannel[ch] = await pruneList(items);
  }

  return {
    ...payload,
    rankings,
    carousel,
    watchlist,
    mysteryThrillers,
    stormont,
    scheduleByChannel,
  };
}
