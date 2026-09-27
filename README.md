# TV Zen — Halloween Tonight Dashboard

Personal **what's on TV tonight** dashboard for UK free-to-air / LG Smart TV browsing. Fluid Halloween-themed UI (CryptoZen / ZenWallet-inspired motion), ranked listings, carousel, soaps & thriller watchlist, Stormont coverage, MCP **Reverser** guardrails panel, cookie notice, and legal disclaimer.

## Data sources (free)

- [Freeview-EPG](https://github.com/dp247/Freeview-EPG) XMLTV (`epg.xml`) — community-maintained UK listings

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown by Vite. In dev, `/api/tonight` parses live EPG with a 30-minute cache.

## Production build

```bash
cp .env.example .env   # set VITE_OWNER_NAME for your copyright line
npm run build
npm run preview
```

Build pre-generates `public/data/tonight.json` for fast static hosting.

## Features

- Regional BBC One / ITV (London, NI, Scotland, Wales, North West, Yorkshire)
- Rankings weighted for Coronation Street, Emmerdale, Midsomer Murders, mystery/thriller, Stormont
- Responsive layout, Framer Motion transitions, `prefers-reduced-motion` support
- MCP panel: compliance guardrails for frontend/design handoff

## Legal

Personal use only. Not affiliated with broadcasters or LG. See in-app disclaimer.
