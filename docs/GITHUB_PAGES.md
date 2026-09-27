# Enable GitHub Pages (one-time)

The workflow is already on `main`. You must turn on Pages in the repo settings:

1. Open **[Settings → Pages](https://github.com/tgollogly/TV-Highligts/settings/pages)**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Re-run the workflow: **[Actions → Deploy GitHub Pages → Run workflow](https://github.com/tgollogly/TV-Highligts/actions/workflows/deploy-github-pages.yml)**

## Your URL

**https://tgollogly.github.io/TV-Highligts/**

Data refreshes when the workflow runs (each push to `main`, plus the Cloudflare schedule still rebuilds the JSON in CI).

## CI / Node on Actions

Workflows use **Node 22** for builds and pin current action majors (`checkout@v7`, `setup-node@v7`, etc.).  
`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` is set per [GitHub’s Node 20 deprecation notice](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/).

## iPhone — Add to Home Screen

The PWA manifest uses **relative** `start_url` (`./`) so the icon opens  
`https://tgollogly.github.io/TV-Highligts/` (not the site root, which 404s).

If you added the icon before this fix, **remove it** and add again after the latest deploy.

## Privacy

`robots.txt` and `noindex` headers are included. For stronger privacy, keep the repo private (GitHub Pro) or use Cloudflare Access on a custom domain instead of sharing the `github.io` link.
