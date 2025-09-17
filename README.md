# PES Mobile Tournament (Vite + React + Tailwind)

Quick project scaffold for deploying to Vercel.

## Features
- Landing page
- Tournament list
- Registration form (saves to localStorage and optionally POSTs to an endpoint)

## How to use
1. Install dependencies:
   ```bash
   npm install
   ```
2. Local dev:
   ```bash
   npm run dev
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Deploy to Vercel:
   - Create a new project on https://vercel.com → Import → Upload ZIP (this file).
   - Set environment variable `VITE_FORM_ENDPOINT` in Vercel to a URL that accepts POST JSON (optional).
   - Build command: `npm run build`, Output directory: `dist`

## Notes
- If `VITE_FORM_ENDPOINT` is not set, registrations are stored only in the browser's localStorage.
- For Google Sheets integration, you can use a serverless function or services like `sheet.best` / `formsubmit.co`.
