import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig } from 'vite';
import { getTonightPayload } from './server/epgService';

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
        const siteUrl = process.env.VITE_SITE_URL ?? 'https://tonight.tgollogly.dev';
        return html.replaceAll('https://tonight.tgollogly.dev', siteUrl.replace(/\/$/, ''));
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
