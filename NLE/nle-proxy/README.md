# NLE Proxy (TypeScript)

Minimal CORS proxy for your NLE UI.

## Setup

```bash
npm install
# or if you haven't yet:
npm i
```

Create `.env`:
```ini
PORT=8787
ALLOW_ORIGINS=*
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY
```

## Run

```bash
npm run dev
# or build:
npm run build && npm start
```

Check health:
- http://localhost:8787/health

In the NLE UI (⚙ Settings):
- Proxy Base URL: `http://localhost:8787`
