import { SITE } from '../config';
import type { TonightPayload } from '../../server/epgService';

type Props = { payload: TonightPayload | null };

export function LegalFooter({ payload }: Props) {
  return (
    <footer className="site-footer">
      <section>
        <h2>Legal disclaimer</h2>
        <p>
          {SITE.name} is a personal dashboard for free-to-air UK TV listings. It is not affiliated with, endorsed by, or
          connected to BBC, ITV, Channel 4, Channel 5, LG Electronics, or any broadcaster. Programme data is supplied
          by community XMLTV sources and may be incomplete or delayed. iPlayer / ITVX / STV Player catch-up availability
          is not guaranteed from linear EPG data — always check the official apps on your LG Smart TV.
        </p>
      </section>
      {payload?.sources.map((s) => (
        <p key={s.name} className="source-line">
          Data: <a href={s.url} rel="noopener noreferrer">{s.name}</a> — {s.license}
        </p>
      ))}
        <p>
          Licensed under <a href="https://github.com/tgollogly/TV-Highligts/blob/main/LICENSE">MIT</a> — see also{' '}
          <a href="https://github.com/tgollogly/TV-Highligts/blob/main/LEGAL.md">LEGAL.md</a>.
        </p>
        <p className="copyright">
        © {SITE.year} {SITE.owner}. All original UI design and code. Programme metadata remains property of respective
        rights holders. Live site: <a href={SITE.url}>{SITE.url}</a>
      </p>
    </footer>
  );
}
