# Custom subdomain — `tvzen.tgollogly.dev`

## 1. GitHub Pages

1. Open **Settings → Pages** on `tgollogly/TV-Highligts`.
2. Under **Build and deployment**, set source to **GitHub Actions**.
3. Merge or push the branch with `.github/workflows/deploy-pages.yml`.
4. Wait for the **Deploy TV Zen to GitHub Pages** workflow to finish.

## 2. DNS (Cloudflare example)

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `tvzen` | `tgollogly.github.io` | DNS only recommended |

The repo includes `public/CNAME` with `tvzen.tgollogly.dev` so GitHub serves the custom host.

## 3. GitHub custom domain

In **Settings → Pages → Custom domain**, enter:

```
tvzen.tgollogly.dev
```

Enable **Enforce HTTPS** when the certificate is ready.

## 4. Different domain?

1. Edit `public/CNAME` with your subdomain (e.g. `tv.yourdomain.com`).
2. Set `VITE_SITE_URL` in `.env` and in the GitHub Actions workflow env.
3. Update `index.html` Open Graph `og:url` and `og:image` URLs to match.

## 5. Verify

- https://tvzen.tgollogly.dev loads the app
- https://tvzen.tgollogly.dev/og-share.png shows the share image
- iPhone: Safari → Add to Home Screen → icon appears
