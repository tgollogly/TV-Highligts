<p align="center">
  <img src="docs/hero.png" alt="TV Zen — Northern Ireland tonight and on-demand dashboard" width="720" />
</p>

<h1 align="center">TV Zen</h1>

<p align="center">
  <strong>Personal UK TV dashboard</strong> — Northern Ireland first · linear tonight · BBC iPlayer &amp; ITVX on-demand · Halloween fluid UI
</p>

<p align="center">
  <a href="https://tvzen.tgollogly.dev"><img src="https://img.shields.io/badge/🌐_Live-tvzen.tgollogly.dev-ff7a18?style=for-the-badge" alt="Live site" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Region-Northern_Ireland-5eead4?style=for-the-badge" alt="NI focus" />
  <img src="https://img.shields.io/badge/PWA-iPhone_&_LG-1a0b2e?style=for-the-badge" alt="PWA" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/EPG-Freeview--EPG-0ea5e9" alt="EPG source" />
  <img src="https://img.shields.io/badge/On_demand-BBC_iPlayer_·_ITVX-f97316" alt="On demand" />
  <img src="https://img.shields.io/badge/©-Thomas_Gollogly-8b5cf6" alt="Copyright" />
</p>

---

## Live URL

| | |
|---|---|
| **Production** | **[https://tvzen.tgollogly.dev](https://tvzen.tgollogly.dev)** |
| **Share image** | [og-share.png](https://tvzen.tgollogly.dev/og-share.png) |
| **Add to iPhone Home Screen** | Open the site in Safari → Share → **Add to Home Screen** (uses `apple-touch-icon` + PWA manifest) |

> **DNS (one-time):** In Cloudflare (or your DNS host) for `tgollogly.dev`, add  
> `CNAME` **`tvzen`** → **`tgollogly.github.io`** (DNS only / grey cloud is fine).  
> Then enable **GitHub Pages** for this repo (Settings → Pages → GitHub Actions).  
> See [docs/DNS.md](docs/DNS.md) for full steps.

---

## Features

| Area | What you get |
|------|----------------|
| **Northern Ireland** | Default region — BBC One NI, UTV, Stormont & politics |
| **On demand** | Curated BBC iPlayer & ITVX hubs + deep links for mystery, thriller, soaps |
| **Linear tonight** | Rankings, carousel, channel timelines (Freeview-EPG) |
| **Watchlist** | Coronation Street, Emmerdale, Midsomer Murders, Vera, Shetland, Line of Duty, … |
| **MCP Reverser panel** | Design-team guardrails (cookies, attribution, rate limits) |
| **Share & PWA** | Open Graph / Twitter cards, manifest, iPhone home-screen icon |

---

## Quick start (local)

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build && npm run preview
```

---

## Configuration

| Variable | Purpose |
|----------|---------|
| `VITE_OWNER_NAME` | Copyright name (default: **Thomas Gollogly**) |
| `VITE_SITE_URL` | Canonical URL for meta tags (default: **https://tvzen.tgollogly.dev**) |

---

## Data sources (free)

- [Freeview-EPG](https://github.com/dp247/Freeview-EPG) — UK XMLTV listings (personal use; community maintained)
- On-demand links — official **BBC iPlayer**, **ITVX**, **Channel 4** search/category URLs (no private APIs)

---

## Legal

| Document | Summary |
|----------|---------|
| **[LICENSE](LICENSE)** | MIT — Copyright © 2026 **Thomas Gollogly** |
| **[LEGAL.md](LEGAL.md)** | Not affiliated with BBC, ITV, LG, etc.; personal dashboard; no warranty |

Programme titles, images, and metadata belong to their respective rights holders.

---

## Stack

Vite · React 19 · TypeScript · Framer Motion · static EPG bundle at build time

---

<p align="center">
  <sub>Built by <strong>Thomas Gollogly</strong> · <a href="https://tgollogly.dev">tgollogly.dev</a></sub>
</p>
