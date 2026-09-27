import { getTonightPayload } from '../../server/epgService';

export async function onRequestGet({ request }: { request: Request }): Promise<Response> {
  const region = new URL(request.url).searchParams.get('region') ?? 'ni';
  try {
    const payload = await getTonightPayload(region);
    return Response.json(payload, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
