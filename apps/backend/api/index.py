"""Vercel serverless entry point."""

import sys
from pathlib import Path
from mangum import Mangum

# Add parent directory to path so we can import src
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

from src.main import app as fastapi_app

# Wrap FastAPI app with Mangum for serverless compatibility
handler = Mangum(fastapi_app, lifespan="off")
