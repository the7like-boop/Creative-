# AI Creative Studio – MVP Scaffold

Responsive German-language creative studio with a React/Vite frontend and Express API.

## Included
- Dashboard and navigation for image, video, reference, projects and settings areas
- Image/video job submission UI
- Reference image upload (PNG/JPG/WEBP, max. 20 MB)
- Social presets: Instagram Reels, TikTok, Facebook Reels, Instagram Feed, square and landscape
- Server-side validation of video duration (1–15 seconds)
- Provider adapter contracts for image and video generation
- Explicit mock mode: no fake generated media or false success claims

## Requirements
- Node.js 20+
- npm

## Run locally
```bash
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL printed in the terminal (normally http://localhost:5173). API: http://localhost:8787/api/health

## Production build
```bash
npm run build
npm start
```
The Express server serves `dist` after building.

## Connect real AI providers
Implement the provider contracts in `server/providers/imageProvider.js` and `server/providers/videoProvider.js`.
Keep provider API keys in `.env` on the server. Do not expose keys in frontend variables.
Real video providers commonly return asynchronous job IDs; add a provider-specific status polling endpoint and persistent job store before production use.

## Important limitations
This is a runnable MVP scaffold, not a finished generative AI service. Image/video generation is intentionally in mock mode until you configure a provider API and implement its adapter. Social publishing, authentication, billing, cloud storage, durable job queues, and production monitoring are not yet implemented.


## iPhone / PWA

Das Projekt enthält jetzt ein PWA-Manifest, App-Icons, einen Service Worker und ein angepasstes mobiles Layout.
Für die Installation auf dem iPhone muss die Anwendung zuerst über HTTPS gehostet werden (Frontend und API).
Danach in Safari öffnen → Teilen → „Zum Home-Bildschirm“ → „Als Web-App öffnen“ aktivieren (falls angeboten) → Hinzufügen.
Der App-Shell-Cache kann die Oberfläche zwischenspeichern; Generierung und Upload benötigen weiterhin eine erreichbare Backend-API.
Derzeit ist der Generierungsmodus weiterhin ein Mock/Adapter-Gerüst und erzeugt noch keine echten KI-Medien.


## Render deployment

A `render.yaml` Blueprint is included. In Render, create a new Blueprint and connect the GitHub repository containing this project. Render will build the Vite frontend and start the Express server from the same Node web service. The service health check uses `/api/health`.

Important: Render's free web services can sleep after inactivity. Uploaded reference files are stored on the service filesystem and may not persist across redeploys/restarts on the free plan. Do not upload sensitive files. Real AI generation still requires provider adapters and server-side API keys.
