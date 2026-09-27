import { motion } from 'framer-motion';
import type { TonightPayload } from '../../server/epgService';
import type { OnDemandPick } from '../../server/onDemandNi';
import { ProgrammeImage } from './ProgrammeImage';

type Props = { data: TonightPayload };

function PickCard({ pick }: { pick: OnDemandPick }) {
  return (
    <motion.a
      href={pick.url}
      target="_blank"
      rel="noopener noreferrer"
      className="ondemand-card"
      whileHover={{ y: -3 }}
    >
      <div className="ondemand-media">
        <ProgrammeImage src={pick.image} className="ondemand-img" />
        <span className="platform-pill">{pick.platform}</span>
      </div>
      <div>
        <h3>{pick.title}</h3>
        <p>{pick.description}</p>
        <ul className="tag-row">
          {pick.tags.slice(0, 4).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </motion.a>
  );
}

export function OnDemandSection({ data }: Props) {
  const od = data.onDemand;
  const isNi = data.region === 'Northern Ireland';

  if (!isNi && !od.curatedMystery.length) return null;

  return (
    <section className="panel section ondemand" id="on-demand">
      <header className="section-head">
        <h2>On demand — Northern Ireland</h2>
        <p>BBC iPlayer, ITVX &amp; catch-up deep links for mystery, thriller, soaps &amp; Stormont</p>
      </header>

      {od.hubs.length > 0 && (
        <div className="hub-row">
          {od.hubs.map((hub) => (
            <a key={hub.id} className="hub-link" href={hub.url} target="_blank" rel="noopener noreferrer">
              <strong>{hub.title}</strong>
              <span>{hub.platform}</span>
            </a>
          ))}
        </div>
      )}

      <h3 className="subhead">Mystery &amp; thriller on demand</h3>
      <div className="card-grid">
        {od.mysteryOnDemand.map((pick) => (
          <PickCard key={pick.id} pick={pick} />
        ))}
      </div>

      {od.fromTonightLinear.length > 0 && (
        <>
          <h3 className="subhead">From today&apos;s NI TV — likely catch-up</h3>
          <div className="card-grid">
            {od.fromTonightLinear.slice(0, 8).map((pick) => (
              <PickCard key={pick.id} pick={pick} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
