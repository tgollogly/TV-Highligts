# Privacy, bots & GitHub Pages

## Is GitHub Pages allowed for this project?

**Generally yes**, for a personal TV dashboard, if you:

- Follow the [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) and [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#usage-limits)
- Keep [LEGAL.md](../LEGAL.md) disclaimers (not affiliated with broadcasters; personal use)
- Do not redistribute full EPG databases as a commercial product

**But GitHub Pages is a poor fit for “keep it private”:**

| | GitHub Pages | Cloudflare + Access |
|--|--------------|---------------------|
| URL is public | Yes (`*.github.io` or custom domain) | You choose |
| Login wall | No | Yes (email OTP) |
| Repo visibility | Public repo is indexed by Google | Repo can stay private |
| Bot blocking | Only hints (`robots.txt`, `noindex`) | Access blocks everyone without login |

**Recommendation:** Keep hosting on **Cloudflare** (`tonight.tgollogly.dev`), **do not** enable GitHub Pages. Use this repo only for source code.

## What we do to discourage Google & bots

These are **signals**, not a guarantee (malicious bots ignore `robots.txt`):

- `public/robots.txt` — `Disallow: /` for major crawlers
- `index.html` — `noindex, nofollow, noarchive, nosnippet, noimageindex`
- `public/_headers` — `X-Robots-Tag` on all responses (Cloudflare Pages)
- `Referrer-Policy: no-referrer` — less leakage when you click out

## What actually keeps it private

1. **Cloudflare Access** on `tonight.tgollogly.dev` (allow only your email) — **best**
2. **Private GitHub repo** — code not listed; site still public if you use Pages
3. **Do not** post the URL on social media or in README badges if you want obscurity
4. Optional: Cloudflare **Bot Fight Mode** / WAF on the zone

## If a page was already indexed

Use [Google Search Console](https://search.google.com/search-console) → Removals (temporary) and ensure `noindex` is live, then request removal.
