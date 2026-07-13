# Akaash Daniel — Portfolio

Built with React + Vite + Tailwind CSS + Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`.

## Deploy to Netlify

**Option A — connect GitHub (recommended, gives you auto-deploy on every push):**
1. Push this project to a GitHub repo.
2. On Netlify: "Add new site" → "Import an existing project" → pick the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy.

**Option B — drag and drop (quick, no auto-deploy):**
1. Run `npm run build` locally.
2. Drag the generated `dist` folder onto the Netlify dashboard.

## Editing content

All page content lives in `src/components/` — one file per section
(`Hero.jsx`, `About.jsx`, `Services.jsx`, `Projects.jsx`, etc).
Colors and fonts are defined in `tailwind.config.js`.
