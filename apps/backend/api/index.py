"""Vercel serverless entry point."""

from src.main import app

# Vercel expects the app to be named 'app' or exported as a handler
handler = app
