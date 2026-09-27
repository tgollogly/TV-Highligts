import { useCallback, useEffect, useState } from 'react';
import type { TonightPayload } from '../../server/epgService';
import type { RegionId } from '../config';

type Bundle = {
  generatedAt: string;
  regions: Record<string, TonightPayload>;
};

export function useTonight(region: RegionId) {
  const [data, setData] = useState<TonightPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (import.meta.env.DEV) {
        const res = await fetch(`/api/tonight?region=${region}`);
        if (!res.ok) throw new Error(await res.text());
        setData((await res.json()) as TonightPayload);
      } else {
        const res = await fetch('/data/tonight.json');
        if (!res.ok) throw new Error('Static EPG bundle missing — run npm run build');
        const bundle = (await res.json()) as Bundle;
        const payload = bundle.regions[region];
        if (!payload) throw new Error(`No data for region ${region}`);
        setData(payload);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
