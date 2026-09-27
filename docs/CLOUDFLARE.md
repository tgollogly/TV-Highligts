# Deploy on Cloudflare — `tonight.tgollogly.dev`

Private hosting on **your** Cloudflare account. **No GitHub Pages.**

| Setting | Value |
|---------|--------|
| Subdomain | `tonight.tgollogly.dev` |
| Pages project | `ni-tonight` |
| Config file | [`site.config.json`](../site.config.json) |

## 1. Build

```bash
npm ci
cp .env.example .env
npm run build
```

## 2. Deploy

```bash
npx wrangler login
npm run deploy:cloudflare
```

## 3. Custom domain

**Workers & Pages** → **ni-tonight** → **Custom domains** → add **`tonight.tgollogly.dev`**.

Cloudflare creates DNS on `tgollogly.dev` when the zone is on your account.

## 4. Privacy (Cloudflare Access)

1. **Zero Trust** → **Access** → **Applications**
2. Self-hosted app: `tonight.tgollogly.dev`
3. Policy: allow **your email** only

## 5. Disable GitHub Pages

Repo **Settings → Pages** → source **None** (if ever enabled). CI only runs lint + build ([`ci.yml`](../.github/workflows/ci.yml)).

## CI secrets (optional auto-deploy to Cloudflare)

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID |

Do not re-enable GitHub Pages deployment workflows.
