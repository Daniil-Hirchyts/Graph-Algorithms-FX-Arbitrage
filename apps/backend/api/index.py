"""Vercel serverless entry point."""

import sys
import os
from pathlib import Path

# Add parent directory to path so we can import src
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

# Set working directory to backend root for file operations
os.chdir(str(backend_root))

from mangum import Mangum
from src.main import app

# Wrap FastAPI app with Mangum for serverless compatibility
# This is the handler that Vercel will invoke
handler = Mangum(app, lifespan="off")
