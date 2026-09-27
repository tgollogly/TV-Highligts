import { useEffect, useState } from 'react';

const KEY = 'tvzen-cookie-consent';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-live="polite">
      <div>
        <h2 id="cookie-title">Cookies & local storage</h2>
        <p>
          We store your region preference and cookie consent choice in your browser only. No advertising trackers. EPG
          images may load from broadcaster CDNs when you browse listings.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(KEY, 'accepted');
          setVisible(false);
        }}
      >
        Accept essential cookies
      </button>
    </div>
  );
}
