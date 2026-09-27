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

## Auto-deploy from GitHub (recommended)

Every push to **`main`** runs [deploy-cloudflare.yml](../.github/workflows/deploy-cloudflare.yml).

### One-time: add repository secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Where to get it |
|-------------|-----------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → **Workers & Pages** → right sidebar **Account ID** |
| `CLOUDFLARE_API_TOKEN` | [Create token](https://dash.cloudflare.com/profile/api-tokens) → **Custom token** → permissions: **Account → Cloudflare Pages → Edit** (and **Account → Account Settings → Read**). Scope to your account. |

After both secrets are saved, either push to `main` or run **Actions → Deploy Cloudflare Pages → Run workflow**.

Then attach custom domain **`tonight.tgollogly.dev`** on the **ni-tonight** Pages project (first deploy may create the project automatically).

Do not enable GitHub Pages on this repository.
