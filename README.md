# DaVinci Dialogue (MOCCA Hackathon)

<img src="docs/design/davinci-dialogue-logo.png" alt="DaVinci Dialogue logo" width="160" align="right" />

A web app that turns a spoken or typed prompt, or a quick hand-drawn sketch, into an AI-generated image, built in two days at a hackathon.

## Context

DaVinci Dialogue was built at the MOCCA hackathon on 21 and 22 November 2024 by Lucas Keller ([@xD33m](https://github.com/xD33m)), Tiago and Leeniy ([@Leeniy](https://github.com/Leeniy)). Leeniy contributed the logo, icons, loading animation and Christmas assets. The repository contains the whole two-day history (77 commits), including a CI/CD pipeline that built Docker images and deployed them to a self-hosted Raspberry Pi.

> Screenshot: not yet added. The deployed instance is no longer online.

## Features

- **Text to image**: type a prompt and generate a 512x512 image with the OpenAI Images API.
- **Voice prompts**: click the microphone to dictate the prompt (browser Web Speech API, `en-GB`); the recognised text is sent straight to image generation.
- **Sketch to image**: switch to drawing mode, sketch on a canvas and let the backend turn the drawing into a realistic image (OpenAI image edit endpoint).
- **Gallery**: generated images and their prompts are kept in `localStorage` and shown as "Your Artwork", with a clear button.
- **Christmas mode**: a toggle that adds floating decorations, an animated RGB title and a Christmas video while an image is generated.
- Confetti when a generation finishes.
- **Dev mode without API costs**: unless `ENV=prod`, the image endpoints wait two seconds and return a random placeholder image from picsum.photos instead of calling OpenAI.

## Tech stack

| Part | Technologies |
| --- | --- |
| Frontend (`frontend/`) | Angular 19 (standalone components, signals), Angular Material, SCSS, canvas-confetti, Web Speech API |
| Backend (`backend/`) | Node.js, Express, TypeScript, OpenAI Node SDK |
| Delivery | Docker multi-stage builds (ARM64), GitHub Actions, GitHub Container Registry, Docker Compose, Traefik, self-hosted runner on a Raspberry Pi |

## Getting started

Requirements: Node.js 20 and npm, plus an OpenAI API key.

```bash
npm install          # root postinstall also installs backend/ and frontend/
cp backend/.env.template backend/.env   # then set OPENAI_API_KEY (and ENV=prod for real image generation)
npm start            # runs the backend (port 3000) and the Angular dev server together
```

Open the URL printed by the Angular CLI (default http://localhost:4200). The dev server proxies `/api` to the backend (`frontend/src/proxy.conf.json`).

Run the parts separately:

```bash
cd backend && npm run dev           # nodemon + ts-node
cd frontend && npm start            # ng serve
```

### API

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/api/generate-image` | `{ "prompt": "..." }` | `{ "imageUrl": "..." }` |
| `POST` | `/api/generate-image-from-drawing` | `{ "image": "<base64 PNG>" }` | `{ "imageUrl": "..." }` |
| `POST` | `/api/chat` | `{ "message": "..." }` or `{ "messages": [...] }` | chat completion text (gpt-4o) |
| `GET` | `/api/hello` | | health/greeting message |

`/api/chat` is implemented in the backend but its UI is commented out in the frontend.

## Architecture and deployment

```
Browser (Angular SPA)  --/api-->  Express backend  -->  OpenAI API
```

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Builds the frontend and backend Docker images for `linux/arm64` with Buildx and QEMU and pushes them to GHCR (`latest` plus a `branch.date.sha` tag, with registry build cache).
2. On a self-hosted runner (a Raspberry Pi), pulls the new images and runs `docker compose up -d`, passing `OPENAI_API_KEY` from repository secrets. Traefik routes the site and `/api` on one host name to the two containers.

Frontend container: Angular production build served with `serve`. Backend container: compiled TypeScript run with pm2.

## Repository layout

```
frontend/      Angular app (components: dialogue, image-generator, canvas, image-history, christmas)
backend/       Express API and OpenAI service
docs/design/   Logo, icons and loading-spinner source video
docker-compose.yml, .github/workflows/deploy.yml   Deployment
```

## Status

Hackathon project, finished on 22 November 2024 and no longer developed. The repository has no license file because the code was written by several team members.
