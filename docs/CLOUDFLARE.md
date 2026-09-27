# Deploy TV Zen on Cloudflare only (private subdomain)

TV Zen is meant to live on **your Cloudflare account** at a subdomain such as **`https://tvzen.tgollogly.dev`** — **not** on GitHub Pages.

## 1. Build locally

```bash
npm ci
cp .env.example .env
npm run build
```

## 2. Deploy static files to Cloudflare Pages

Install Wrangler once (already in devDependencies after `npm ci`):

```bash
npx wrangler login
npm run deploy:cloudflare
```

This runs `wrangler pages deploy dist --project-name=tvzen` (override with env `CF_PAGES_PROJECT`).

On first deploy, Wrangler creates the Pages project in your Cloudflare account.

## 3. Custom subdomain in Cloudflare

1. Open **Workers & Pages** → project **tvzen** → **Custom domains**.
2. Add **`tvzen.tgollogly.dev`** (or your chosen subdomain).
3. Cloudflare will create the DNS record on `tgollogly.dev` automatically if the zone is on Cloudflare.

No `CNAME` to `github.io` is required.

## 4. Keep it private (recommended)

Pick one or combine:

### A. Cloudflare Access (best for “only me”)

1. **Zero Trust** → **Access** → **Applications** → Add application.
2. Type: **Self-hosted**; domain: `tvzen.tgollogly.dev`.
3. Policy: allow **your email** (or a one-time PIN / service token).
4. Visitors must authenticate before seeing the dashboard.

### B. No public listing

- `robots.txt` disallows crawlers; `noindex` is set in `index.html`.
- Do **not** link the URL on public profiles if you want it obscure.
- Repo can stay private on GitHub; deploy only via Wrangler from your machine or a private CI secret.

### C. Disable GitHub Pages

If Pages was enabled on the GitHub repo: **Settings → Pages → disable** so nothing is served from `github.io`.

## 5. iPhone home screen

After Access login (if enabled), open in Safari → **Share → Add to Home Screen**. Icons and manifest are included.

## 6. Update share URL

Set in `.env` before build:

```env
VITE_SITE_URL=https://tvzen.tgollogly.dev
VITE_OWNER_NAME=Thomas Gollogly
```

Rebuild and redeploy so Open Graph tags match your private URL.

## Environment variables (CI optional)

| Variable | Purpose |
|----------|---------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy (CI only; scope: Account + Pages Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CF_PAGES_PROJECT` | Default `tvzen` |

Example CI (private repo + secrets only — **not** GitHub Pages):

```yaml
# Optional: .github/workflows/deploy-cloudflare.yml — only if you want auto-deploy to CF, not GH Pages
- run: npm run deploy:cloudflare
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Do **not** enable GitHub Pages for this repository.
