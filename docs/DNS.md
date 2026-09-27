# DNS — Cloudflare subdomain only

GitHub Pages is **not** used for TV Zen.

## Subdomain on Cloudflare

1. Ensure **`tgollogly.dev`** is a zone on Cloudflare.
2. Deploy the app with [CLOUDFLARE.md](./CLOUDFLARE.md) (`wrangler pages deploy`).
3. In the Pages project, add custom domain **`tvzen.tgollogly.dev`**.

Cloudflare will attach the correct DNS record to your Pages project.

## Different subdomain?

Use e.g. `watch.tgollogly.dev`:

1. Add that custom domain in the Pages project.
2. Set `VITE_SITE_URL` in `.env` to match.
3. Update `index.html` `og:url` / `og:image` if you hard-coded the old host (or rely on env at build time).

## Privacy

Use **Cloudflare Access** on the subdomain so only you can open the site. See [CLOUDFLARE.md](./CLOUDFLARE.md).
