# Agent Workflow Builder

A professional, dark-themed **agent orchestration** UI: graph editor for triggers, LLM agents, tools, **MCP servers**, memory, control flow (parallel / merge / conditions), guardrails, human-in-the-loop, outputs, and **custom steps** you name and document yourself. Includes **JWT auth**, **SQLite** persistence for workflows, **offline-friendly** local drafts, **Settings** (including MCP profiles), a **Help** center, and a **PWA** build (installable / cached shell via `vite-plugin-pwa`).

| Layer | Stack |
|-------|--------|
| Frontend | React 18, TypeScript, Vite, React Flow (`@xyflow/react`), React Router |
| Backend | Node.js, Express, SQLite (`better-sqlite3`), JWT, Zod |
| HTTP client | Native **`fetch` only** (no axios) |

---

## Features

- **Step library**: Trigger, Agent, Memory, Tool, **MCP server**, Condition, Parallel, Merge, Transform, Guardrail, Sub-workflow, Human review, Output, and **Custom** (user-defined type name, definition, and freeform parameters in the inspector).
- **Canvas**: Drag nodes, connect edges, fit view, minimap, dotted background.
- **Node actions**: **Right-click** a step to **Duplicate**, **Remove all connections**, **Copy step as JSON**, or **Delete**. With a step selected, **Delete** or **Backspace** removes it; attached edges are cleaned up. Right-click also focuses the step in the **inspector** (same as left-click).
- **Inspector**: Display name, description, and kind-specific configuration fields (including custom-step text fields).
- **Validation & export**: **Validate** in the top bar runs server-side graph checks when signed in and online; otherwise a local message is shown. **Export JSON** downloads the current workflow document.
- **Auth**: Sign-in / register, demo account, **Continue offline** (local-only guest). Login screen includes animated ambient visuals (robots, flow-to-output motif); app brand mark uses a small robot icon.
- **Sync**: Signed-in users sync the workflow JSON to the API; failures fall back to local storage (`localStorage` draft).
- **Settings** (`/settings`): Default model, MCP server profiles (stdio / SSE / HTTP), privacy notes.
- **Help** (`/help`, `/help/:topicId`): Articles for workflows (incl. custom steps), MCP, settings, and sync.
- **PWA**: Production build registers a service worker for offline caching of the SPA shell and static assets (API calls still need network unless you add your own caching rules).

---

## Requirements

- **Node.js** 18.x or newer (20+ recommended).
- **npm** 9+ (bundled with Node).

The API uses **better-sqlite3** (native addon). On Linux/macOS this usually builds automatically; on Windows you may need [build tools](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md).

---

## Quick start

From the project root:

```bash
chmod +x start.sh
./start.sh
```

The script will:

1. Install root and `server/` dependencies if `node_modules` is missing.
2. Run **both** processes via `npm run dev` (API + Vite).

Then open **http://localhost:5173**.

| Service | URL | Notes |
|---------|-----|--------|
| Web app | http://localhost:5173 | Vite proxies `/api` → API |
| REST API | http://localhost:4000 | `GET /api/health` |

**Demo sign-in:** `demo@example.com` / `demo123` (seeded on first API start).

---

## Manual setup (alternative to `start.sh`)

```bash
npm install
cd server && npm install && cd ..
npm run dev
```

Run parts separately:

```bash
npm run dev:api    # API only
npm run dev:web    # Vite only (expects API on :4000 for proxy)
```

---

## Configuration

### API (`server/`)

Copy the example env file and adjust:

```bash
cp server/.env.example server/.env
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `4000` | HTTP port |
| `JWT_SECRET` | *(dev default)* | **Set a long random value in production** |
| `DATABASE_PATH` | `./data/app.db` | SQLite file (created automatically) |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed browser origin |

### Frontend

Optional root `.env` (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Leave empty in dev to use Vite’s proxy. In production, set to your API origin if different from the static host. |

---

## Production build

```bash
npm run build
```

Builds the API (`server/dist`) and the SPA (`dist/`). Serve `dist/` behind your static host and run the API with `node server/dist/index.js` (after `DATABASE_PATH`, `JWT_SECRET`, and `CORS_ORIGIN` are set for your domain).

```bash
cd server && npm run build && node dist/index.js
```

Use a process manager (systemd, PM2, etc.) for the API in production.

---

## Project layout

```
.
├── start.sh              # One-command dev (API + web)
├── src/                  # React app
│   ├── components/       # WorkflowCanvas (context menu, React Flow), palette, inspector, AuthAmbient, etc.
│   ├── pages/            # Editor, login, settings, help
│   ├── context/          # Auth
│   ├── lib/              # API client (fetch), settings, node defaults
│   ├── nodes/            # Step node UI (AgentStepNode)
│   ├── help/             # Help article copy
│   └── icons/            # Step & brand icons
├── server/
│   ├── src/              # Express app, routes, DB
│   └── data/             # SQLite (gitignored)
├── DESIGN.md             # UI tokens / agent prompt hints
└── package.json
```

---

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Liveness |
| POST | `/api/auth/login` | No | JWT + user |
| POST | `/api/auth/register` | No | Create user |
| GET | `/api/auth/me` | Bearer | Session |
| GET | `/api/workflows` | Bearer | Load user workflow |
| PUT | `/api/workflows` | Bearer | Save workflow JSON |
| POST | `/api/workflows/validate` | Bearer | Validate graph shape |

---

## Security notes

- **Do not commit** `server/.env` or production `JWT_SECRET`.
- This UI is for **modeling** workflows; treat node “config” and Settings MCP hints as **non-secret** documentation unless you wire env-backed secrets in your executor.
- HTTP client code uses **`fetch`** only (no axios), to reduce supply-chain surface.

---

## License

Private / unlicensed unless you add a `LICENSE` file. Third-party packages retain their own licenses.
