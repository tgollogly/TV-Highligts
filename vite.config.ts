import react from '@vitejs/plugin-react';
import { copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig } from 'vite';
import { getTonightPayload } from './server/epgService';

function siteHomeUrl(): string {
  const raw = process.env.VITE_SITE_URL ?? 'https://tonight.tgollogly.dev';
  return raw.endsWith('/') ? raw : `${raw}/`;
}

function epgApiPlugin() {
  return {
    name: 'epg-api',
    configureServer(server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/tonight')) {
          next();
          return;
        }
        try {
          const region = new URL(req.url, 'http://localhost').searchParams.get('region') ?? 'london';
          const payload = await getTonightPayload(region);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'public, max-age=300');
          res.end(JSON.stringify(payload));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    epgApiPlugin(),
    {
      name: 'html-site-url',
      transformIndexHtml(html) {
        const home = siteHomeUrl();
        const siteOrigin = home.replace(/\/$/, '');
        let out = html.replaceAll('https://tonight.tgollogly.dev', siteOrigin);
        out = out.replace(
          '<head>',
          `<head>
    <script>
      (function () {
        var home = ${JSON.stringify(home)};
        var path = ${JSON.stringify(process.env.VITE_BASE_PATH ?? '/')};
        if (location.hostname === 'tgollogly.github.io' && path !== '/' && !location.pathname.startsWith(path)) {
          location.replace(home);
        }
      })();
    </script>`,
        );
        out = out.replace(
          'href="apple-touch-icon.png"',
          `href="${home}apple-touch-icon.png"`,
        );
        return out;
      },
    },
    {
      name: 'pwa-manifest-absolute',
      closeBundle() {
        const outDir = join(process.cwd(), 'dist');
        const home = siteHomeUrl();
        const manifest = {
          id: home,
          name: 'Tonight — NI TV & On Demand',
          short_name: 'Tonight',
          description:
            'Personal UK TV dashboard for Northern Ireland — linear rankings and iPlayer/ITVX on-demand picks.',
          start_url: `${home}?source=homescreen`,
          scope: home,
          display: 'standalone',
          background_color: '#0d0618',
          theme_color: '#1a0b2e',
          lang: 'en-GB',
          icons: [
            {
              src: `${home}apple-touch-icon.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: `${home}og-share.png`,
              sizes: '1200x630',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        };
        writeFileSync(join(outDir, 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);
        copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
      },
    },
  ],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
        },
      },
    },
  },
});
