import { useCallback, useEffect, useState } from 'react';
import type { TonightPayload } from '../../server/epgService';
import type { RegionId } from '../config';

type Bundle = {
  generatedAt: string;
  regions: Record<string, TonightPayload>;
};

const REFRESH_MS = 15 * 60 * 1000;

async function fetchLive(region: RegionId): Promise<TonightPayload> {
  const res = await fetch(`/api/tonight?region=${region}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as TonightPayload;
}

async function fetchStaticBundle(region: RegionId): Promise<TonightPayload> {
  const res = await fetch(`/data/tonight.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Static EPG bundle missing — run npm run build');
  const bundle = (await res.json()) as Bundle;
  const payload = bundle.regions[region];
  if (!payload) throw new Error(`No data for region ${region}`);
  return payload;
}

export function useTonight(region: RegionId) {
  const [data, setData] = useState<TonightPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'static'>('live');
  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      setError(null);
      try {
        const payload = await fetchLive(region);
        setData(payload);
        setSource('live');
      } catch {
        try {
          const payload = await fetchStaticBundle(region);
          setData(payload);
          setSource('static');
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [region],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => void load(true), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load(true);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return { data, loading, error, reload: () => load(false), source };
}
