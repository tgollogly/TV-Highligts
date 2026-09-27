# Cloudflare MCP vs deploy

## What MCP authorization does

When **Cloudflare-bindings** MCP is authorized (`mcp_auth`), the agent can:

- List Workers, KV, R2, D1, etc.
- Read Cloudflare docs via MCP

It **cannot**:

- Run `wrangler pages deploy` (no token is passed to the shell)
- Create or update Pages projects via MCP (no deploy tool exists)

MCP OAuth and Wrangler/GitHub Actions use **separate** credentials.

## What you need to deploy `tonight.tgollogly.dev`

Add **one** of these:

### A. Cursor Cloud secrets (agent deploys for you)

In Cursor → Cloud Agent / environment secrets:

| Secret | Value |
|--------|--------|
| `CLOUDFLARE_API_TOKEN` | Pages **Edit** token |
| `CLOUDFLARE_ACCOUNT_ID` | From Workers & Pages sidebar |

Then ask the agent: “deploy to Cloudflare”.

### B. GitHub Actions (auto on push + every 6h)

Repo → **Settings → Secrets → Actions** — same two secrets.  
Workflow: `.github/workflows/deploy-cloudflare.yml`

### C. Your machine

```bash
npx wrangler login
npm run deploy:cloudflare
```

## Auto-refresh behaviour (static + live)

- Browser calls **`/api/tonight`** (Pages Function) every **15 minutes** and when you return to the tab.
- Falls back to **`/data/tonight.json`** if the API is unavailable.
- GitHub **schedule** rebuilds and redeploys the static bundle every **6 hours**.
