"""Health check and system info endpoints."""

import logging
from typing import List

from fastapi import APIRouter

from ..config import config
from ..models import HealthResponse
from ..cache import graph_cache

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.

    Returns service status and latest snapshot info.
    """
    try:
        latest = graph_cache.latest()
        latest_snapshot = latest[1].timestamp if latest else None
        snapshot_count = graph_cache.size()
    except Exception as e:
        logger.warning(f"Failed to load cache info for health check: {e}")
        latest_snapshot = None
        snapshot_count = 0

    return HealthResponse(
        status="healthy",
        latest_snapshot=latest_snapshot,
        snapshot_count=snapshot_count,
    )


@router.get("/nodes", response_model=List[str])
async def get_available_nodes():
    return config.available_nodes
