# Graph Algorithms Lab

A full-stack monorepo for generating graph datasets, visualizing classic algorithms, and exploring FX arbitrage as a presentation layer. The backend is reusable for other domains; the UI keeps the finance theme.

In the FX view, each node is a currency, each directed edge is an exchange rate, and arbitrage shows up as a path or cycle whose combined rate improves value. The app uses this domain only as a layer on top of core graph theory.

### FX/Arbitrage Mapping

- Nodes represent currency tickers (USD, EUR, JPY, etc.).
- Directed edges represent tradable pairs with an implied rate from source to target.
- A path multiplies rates; if a round-trip cycle yields more than you started with, that is an arbitrage opportunity.
- Negative-log weights convert multiplicative rates into additive costs, letting shortest-path algorithms detect profitable cycles.
- The backend stays domain-agnostic; swap currencies for any node labels and the algorithms still apply.

## Highlights

- Graph dataset generation: random, scenarios, or custom inputs
- Scenario presets with larger node sets for richer experiments
- Randomized pair generation (no fixed connectivity presets)
- In-browser snapshots via Dexie (no server-side persistence)
- FastAPI REST API for graph algorithms
- React/Vite UI for visualization and execution
- Turborepo workspace for easy deployment

## Tech Stack

- Backend: Python, FastAPI
- Frontend: React, Vite, TypeScript, Tailwind
- Local storage: Dexie (IndexedDB)
- Monorepo: Turborepo

## Project Layout

```
/
├── apps/
│   ├── backend/              # FastAPI service
│   └── frontend/             # React/Vite UI
├── package.json              # Turbo workspace root
├── turbo.json
└── README.md
```

## Quickstart (Local)

### 1) Backend dependencies

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r apps/backend/requirements.txt
```

### 2) Frontend dependencies (Turbo workspace)

```bash
npm install
```

### 3) Run both apps with Turbo

```bash
npm run dev
```

Notes:
- Keep the Python venv active before running Turbo, so the backend `dev` script works.
- Frontend runs at http://localhost:5173
- Backend runs at http://localhost:8000

### Run services individually (optional)

Backend:
```bash
cd apps/backend
python -m src.main
```

Frontend:
```bash
cd apps/frontend
npm run dev
```

## Environment Variables

Backend (`apps/backend/.env`):
```bash
API_HOST=0.0.0.0
API_PORT=8000
```

Frontend (`apps/frontend/.env`):
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## API Overview

### Data
- `GET /health` - Service status and in-memory cache info
- `GET /nodes` - Available currency labels for generation
- `POST /generate` - Generate dataset and return `graph_payload`

### Algorithms
All algorithm endpoints accept either:
- `graph_payload` (recommended, always works), or
- `snapshot_id` (only if that snapshot is still in the server in-memory cache)

Endpoints:
- `POST /algorithms/bfs`
- `POST /algorithms/dfs`
- `POST /algorithms/dijkstra`
- `POST /algorithms/bellman-ford`
- `POST /algorithms/floyd-warshall`
- `POST /algorithms/mst/prim`
- `POST /algorithms/mst/kruskal`

## Dataset Generation Examples

### Random
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "random",
    "generation_params": {
      "num_nodes": 10,
      "value_min": 0.1,
      "value_max": 10.0,
      "variance": "medium",
      "seed": 42
    }
  }'
```

### Scenario
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"mode": "scenario", "scenario_id": "negative_cycle"}'
```

### Custom
```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "custom",
    "custom_values": {
      "USD": 1.0,
      "EUR": 0.85,
      "GBP": 1.2,
      "JPY": 0.9
    },
    "nodes": ["USD", "EUR", "GBP", "JPY"],
    "anchor_node": "USD"
  }'
```

## Snapshots and Persistence

- Snapshots are stored in the browser with Dexie (IndexedDB).
- The backend keeps a small in-memory cache only during the server session.
- No snapshot files are written on the server.
- If the backend restarts, `snapshot_id` references are no longer valid.

## Testing

Backend:
```bash
pytest
```

Frontend build check:
```bash
cd apps/frontend
npm run build
```

## Deployment Notes

- Frontend: deploy `apps/frontend` as a Vite app (build output: `dist`).
- Backend: deploy `apps/backend` as a FastAPI service (run `uvicorn src.main:app`).
- For Vercel or similar hosts, point the frontend build to `apps/frontend` and set `VITE_API_BASE_URL`.
