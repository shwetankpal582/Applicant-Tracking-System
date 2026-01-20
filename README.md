# Applicant Tracking System / AI Resume Analyzer

This repository contains a small React + TypeScript web app for analyzing resumes (PDF) using a client-side UI. The project appears scaffolded with React Router's latest tooling and Vite for development.

Key highlights
- Project name (package.json): `ai-resume-analyzer`
- Frameworks: React 19, TypeScript, Vite, React Router v7
- Styling: Tailwind (configured through devDependencies)

Table of contents
- About
- Prerequisites
- Install
- Available scripts
- Project structure
- Important files and components
- How to use (dev & build)
- Troubleshooting
- Contributing
- License & contact

## About

This app provides an interface to upload resumes (PDFs), display them, and show an analysis/score UI. Core code lives under the `app/` directory with reusable UI components in `app/components` and helper utilities in `app/lib`.

## Prerequisites

- Node.js (recommended >= 18)
- npm, yarn, or pnpm (commands below use npm; swap for your package manager if desired)

Open a terminal at the repository root and install dependencies:

```powershell
npm install
```

## Available scripts

These come from `package.json` and are the authoritative commands for this project.

- `npm run dev` — start the dev server (uses `react-router dev`)
- `npm run build` — build the app (uses `react-router build`)
- `npm run start` — serve the built app (uses `react-router-serve`)
- `npm run typecheck` — run `react-router typegen` then `tsc` for TypeScript checks

Example (dev):

```powershell
npm run dev
```

Example (build + serve):

```powershell
npm run build
npm run start
```

## Project structure (relevant files)

Top-level
- `package.json` — scripts and dependencies
- `vite.config.ts`, `tsconfig.json` — build/dev configuration

app/
- `root.tsx` — application root
- `routes.ts` — route mounting
- `components/` — React components (UI pieces)
  - `Accordion.tsx`, `ATS.tsx`, `Details.tsx`, `FileUploader.tsx`, `Navbar.tsx`, `ResumeCard.tsx`, `ScoreBadge.tsx`, `ScoreCircle.tsx`, `ScoreGauge.tsx`, `Summary.tsx`
- `lib/` — utilities and helpers: `pdf2img.ts`, `puter.ts`, `utils.ts`

public/
- `pdf.worker.min.mjs` — PDF.js worker used by `pdfjs-dist`

types/
- Type declarations used to augment or type external modules

routes/
- Route-level components: `auth.tsx`, `home.tsx`, `resume.tsx`, `upload.tsx`, `wipe.tsx`

## Important notes

- The app depends on `pdfjs-dist` and includes `public/pdf.worker.min.mjs`. If you change the `pdfjs-dist` version, ensure the worker path remains compatible.
- React Router v7 is used with new `react-router dev|build|serve` scripts. The dev/build/start scripts in `package.json` are configured to use these tools.

## How to use

- Development: run `npm run dev` and open the address shown in the terminal (Vite/react-router dev server).
- Upload resumes via the UI (see `app/components/FileUploader.tsx` and the `routes/upload.tsx` route).
- Built output will be placed by the router build tooling (see `build/server/index.js` used by `start`).

## Troubleshooting

- If `npm run dev` fails, check that Node.js and npm are installed and the `node_modules` directory is present (run `npm install`).
- If PDF rendering fails, confirm `public/pdf.worker.min.mjs` is reachable by the app and `pdfjs-dist` version matches the worker.
- If TypeScript errors appear, run `npm run typecheck` to see the errors and adjust code or types.

## Contributing

Contributions are welcome. Small suggestions:

1. Fork the repository.
2. Create a feature branch.
3. Make changes and add tests if applicable.
4. Open a pull request describing the change.

Note: Repository currently has no LICENSE file. Add a license file (for example `LICENSE` with an SPDX identifier) if you plan to open-source with a specific license.

## Contact

Repository owner: `shwetankpal582` (GitHub)
Phone No : +91 9451509640
Gmail : shwetankpal582@gmail.com

If you want me to expand this README with screenshots, automated tests, CI workflow, or a contributor code of conduct, tell me which you'd like and I will add it.

---
Generated: README added by development assistant on behalf of repository maintainer.
