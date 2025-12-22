"""FastAPI application entry point."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import algorithms, generate, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Graph Algorithms API",
    description="Dataset generation and graph algorithm execution",
    version="2.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(generate.router, tags=["Data"])
app.include_router(algorithms.router, tags=["Algorithms"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Graph Algorithms API",
        "version": "2.0.0",
        "endpoints": {
            "health": "GET /health",
            "generate": "POST /generate",
            "available_nodes": "GET /nodes",
            "algorithms": {
                "bfs": "POST /algorithms/bfs",
                "dfs": "POST /algorithms/dfs",
                "dijkstra": "POST /algorithms/dijkstra",
                "bellman_ford": "POST /algorithms/bellman-ford",
                "floyd_warshall": "POST /algorithms/floyd-warshall",
                "mst_prim": "POST /algorithms/mst/prim",
                "mst_kruskal": "POST /algorithms/mst/kruskal",
            },
        },
    }


if __name__ == "__main__":
    import uvicorn
    from .config import config

    uvicorn.run(
        "src.main:app",
        host=config.api_host,
        port=config.api_port,
        reload=True,
    )
