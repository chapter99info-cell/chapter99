# PWA Test Checklist

- Run `npm run build`.
- Serve the production build with `npm run preview`.
- Open Chrome DevTools > Application.
- Confirm `manifest.webmanifest` loads without errors.
- Confirm the service worker registers in production preview.
- Toggle offline mode and reload a previously visited route.
- Install the app from the browser install prompt.
- Validate mobile layout at 390px and 768px widths.
- Test PIN routing for all demo roles:
  - Portfolio: `1111`
  - Owner: `2222`
  - Staff: `3333`
  - Cashier: `4444`
  - Super Admin: `9999`
- Trigger a browser notification prompt from an asset expiry alert.
