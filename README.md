# Kadi

Every card you carry, sealed on your device.

Kadi is a local-first card vault (bank cards, IDs, student passes, transit, loyalty).
Single-file app with AES-256-GCM encryption (PBKDF2-SHA256, 150k iterations), passcode-wrapped vault key, fully offline PWA. Zero network calls, no accounts, no tracking.

## Run

Open `index.html` directly, or serve it:

```sh
npx serve .
# or
python3 -m http.server 8000
```

## Scan in 3D

New Card → **Scan card in 3D**: the camera guides a front + back capture,
then three.js (loaded once, on demand) builds a spinnable 3D card from your
photos. Works offline after the first load; without internet it falls back to
saving the photos. Any saved card can be re-opened in 3D from Details → **3D**.

## Settings & profile

Everything lives on the one Settings page: Profile (name + avatar color),
Security (passcode, auto-lock, masking), App (install, offline pack,
3D showcase effects), and Your data (encrypted backup, restore, erase).

## Install

Kadi is a PWA: open https://kadi-app.vercel.app → Settings → Install
(or the browser's Install app / Add to Home Screen). Shortcuts for
Add card and Pay are included.

## Deploy (Vercel)

```sh
vercel --prod
```

Project name: `kadi` (fallback `kadi-app`).

## Files

- `index.html` — the whole app (was `kadi.html`, promoted + rebranded)
- `cozy-nook.html` — alternate cozy-theme prototype, kept for reference
- `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — PWA assets
- `sw.js` — offline service worker
- `vercel.json` — static hosting config

## API

Pages on the same origin can request a payment:

```js
await window.Kadi.requestPayment({ merchant: 'Bean There Cafe', amount: '$4.50', note: 'Table 4' });
```

(`window.CardNook` is kept as a backwards-compatible alias.)
