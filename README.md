<p align="center">
  <img src="docs/hero.png" alt="Tonight — Northern Ireland TV dashboard" width="720" />
</p>

<h1 align="center">Tonight <sub style="font-size:0.45em;color:#b8a8d4">(TV Zen)</sub></h1>

<p align="center">
  <strong>Private NI TV dashboard</strong> — linear tonight · BBC iPlayer &amp; ITVX on-demand · mystery &amp; soaps
</p>

<p align="center">
  <a href="https://tonight.tgollogly.dev"><img src="https://img.shields.io/badge/🌐_Private-tonight.tgollogly.dev-ff7a18?style=for-the-badge" alt="Subdomain" /></a>
  <img src="https://img.shields.io/github/actions/workflow/status/tgollogly/TV-Highligts/ci.yml?branch=main&style=for-the-badge&label=CI" alt="CI" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Host-Cloudflare_Pages-f38020?style=for-the-badge" alt="Cloudflare" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Region-Northern_Ireland-5eead4" alt="NI" />
  <img src="https://img.shields.io/badge/EPG-Freeview--EPG-0ea5e9" alt="EPG" />
  <img src="https://img.shields.io/badge/©-Thomas_Gollogly-8b5cf6" alt="Copyright" />
</p>

---

## Subdomain: `tonight.tgollogly.dev`

| Why this name | |
|---------------|---|
| **Short** | Easy to type on iPhone / LG TV browser |
| **Clear** | “What’s on **tonight**” — matches the product |
| **Professional** | Reads like a personal service, not a dev experiment |
| **Private** | Cloudflare-only; protect with **Access** (not GitHub Pages) |

Canonical config: [`site.config.json`](site.config.json) · Cloudflare project: **`ni-tonight`**

| | |
|---|---|
| **URL** | **https://tonight.tgollogly.dev** |
| **Share image** | https://tonight.tgollogly.dev/og-share.png |
| **iPhone** | Safari → Share → **Add to Home Screen** (icon: “Tonight”) |

Deploy: **[docs/CLOUDFLARE.md](docs/CLOUDFLARE.md)** · DNS: **[docs/DNS.md](docs/DNS.md)**

---

## Features

| Area | What you get |
|------|----------------|
| **Northern Ireland** | Default region — BBC One NI, UTV, Stormont |
| **On demand** | BBC iPlayer & ITVX hubs + mystery/thriller deep links |
| **Linear tonight** | Rankings, carousel, channel timelines |
| **Watchlist** | Corrie, Emmerdale, Midsomer, Vera, Shetland, Line of Duty, … |
| **Compliance** | Cookie notice, MIT license, LEGAL.md |

---

## Quick start

```bash
npm ci
cp .env.example .env
npm run dev
```

```bash
npm run build && npm run preview
```

### Cloudflare deploy

```bash
npx wrangler login
npm run deploy:cloudflare
```

Pages → project **`ni-tonight`** → custom domain **`tonight.tgollogly.dev`**.

**Auto-deploy:** add GitHub secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` — see [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md). Pushes to `main` then deploy automatically.

---

## Configuration

| Variable | Default |
|----------|---------|
| `VITE_OWNER_NAME` | Thomas Gollogly |
| `VITE_SITE_URL` | https://tonight.tgollogly.dev |
| `CF_PAGES_PROJECT` | ni-tonight |

---

## Legal

| Document | |
|----------|---|
| [LICENSE](LICENSE) | MIT © 2026 **Thomas Gollogly** |
| [LEGAL.md](LEGAL.md) | Personal dashboard; not affiliated with broadcasters |

---

<p align="center">
  <sub>Thomas Gollogly · <a href="https://tgollogly.dev">tgollogly.dev</a></sub>
</p>
