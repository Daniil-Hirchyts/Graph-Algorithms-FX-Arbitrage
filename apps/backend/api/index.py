"""Vercel serverless entry point."""

import sys
import os
from pathlib import Path

# Add parent directory to path so we can import src
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

# Set working directory to backend root for file operations
os.chdir(str(backend_root))

try:
    from mangum import Mangum
    from src.main import app as fastapi_app

    # Wrap FastAPI app with Mangum for serverless compatibility
    handler = Mangum(fastapi_app, lifespan="off")
except Exception as e:
    print(f"Error initializing app: {e}")
    import traceback
    traceback.print_exc()
    raise
