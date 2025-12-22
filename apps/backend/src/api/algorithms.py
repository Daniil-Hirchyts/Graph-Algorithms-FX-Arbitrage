"""Algorithm execution endpoints."""

import logging
from datetime import datetime, timezone
from typing import Optional, Tuple

from fastapi import APIRouter, HTTPException

from ..algorithms import all_pairs, mst, shortest_path, traversal
from ..algorithms.graph import Graph
from ..models import (
    BFSRequest,
    BFSResponse,
    BellmanFordRequest,
    BellmanFordResponse,
    CentralityInfo,
    DFSRequest,
    DFSResponse,
    DijkstraRequest,
    DijkstraResponse,
    FloydWarshallRequest,
    FloydWarshallResponse,
    GraphPayload,
    MSTEdgeResponse,
    MSTRequest,
    MSTResponse,
    PathDetail,
)
from ..cache import graph_cache

logger = logging.getLogger(__name__)

router = APIRouter()


async def load_graph_from_snapshot(
    snapshot_id: Optional[str] = None,
    graph_payload: Optional[GraphPayload] = None,
) -> Tuple[str, Graph]:
    """
    Load graph from graph_payload or cache by snapshot_id.

    Args:
        snapshot_id: Optional snapshot ID (used to read cache)

    Returns:
        Tuple of (resolved_snapshot_id, Graph instance)

    Raises:
        HTTPException: If required data is missing or cache lookup fails
    """
    try:
        if graph_payload is not None:
            resolved_snapshot_id = snapshot_id or "local"
            if snapshot_id:
                graph_cache.set(
                    snapshot_id,
                    graph_payload,
                    datetime.now(timezone.utc).isoformat(),
                )

            graph_payload_dict = graph_payload.model_dump(mode="json", by_alias=True)
            graph = Graph.from_graph_payload(graph_payload_dict, directed=True)
            return resolved_snapshot_id, graph

        if snapshot_id is None:
            raise HTTPException(
                status_code=400,
                detail="graph_payload is required when no snapshot_id is provided.",
            )

        cached = graph_cache.get(snapshot_id)
        if cached is None:
            raise HTTPException(
                status_code=404,
                detail=f"Snapshot not found in cache: {snapshot_id}",
            )

        graph_payload_dict = cached.graph_payload.model_dump(mode="json", by_alias=True)
        graph = Graph.from_graph_payload(graph_payload_dict, directed=True)
        return snapshot_id, graph

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error loading snapshot: {e}")
        raise HTTPException(status_code=500, detail="Error loading snapshot")


@router.post("/algorithms/bfs", response_model=BFSResponse)
async def run_bfs(request: BFSRequest):
    """
    Run BFS (Breadth-First Search) traversal.

    Returns traversal order, parent map, and depth from start node.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        result = traversal.bfs(graph, request.start_node)

        return BFSResponse(
            snapshot_id=snapshot_id,
            start_node=request.start_node,
            order=result.order,
            parent=result.parent,
            depth=result.depth,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/dfs", response_model=DFSResponse)
async def run_dfs(request: DFSRequest):
    """
    Run DFS (Depth-First Search) traversal.

    Returns traversal order, parent map, discovery times, and finish times.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        result = traversal.dfs(graph, request.start_node)

        return DFSResponse(
            snapshot_id=snapshot_id,
            start_node=request.start_node,
            order=result.order,
            parent=result.parent,
            discovery_time=result.discovery_time,
            finish_time=result.finish_time,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/dijkstra", response_model=DijkstraResponse)
async def run_dijkstra(request: DijkstraRequest):
    """
    Run Dijkstra's shortest path algorithm using weight_cost.

    If target is specified, returns path to target.
    If target is None, returns distances to all reachable nodes.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        result = shortest_path.dijkstra(graph, request.source, request.target)

        # Build path details if target specified and found
        path_details = []
        path = []
        distance_to_target = None

        if request.target and result.found:
            path = result.paths.get(request.target, [])
            distance_to_target = result.distances.get(request.target)

            # Build path details
            for i in range(len(path) - 1):
                u, v = path[i], path[i + 1]
                weight = graph.get_weight(u, v, "cost")
                if weight is not None:
                    path_details.append(
                        PathDetail(**{"from": u, "to": v, "weight": weight})
                    )

        return DijkstraResponse(
            snapshot_id=snapshot_id,
            source=request.source,
            target=request.target,
            found=result.found if request.target else True,
            distance=distance_to_target,
            path=path,
            path_details=path_details,
            all_distances=result.distances,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/bellman-ford", response_model=BellmanFordResponse)
async def run_bellman_ford(request: BellmanFordRequest):
    """
    Run Bellman-Ford shortest path algorithm using weight_neglog.

    Detects negative cycles and returns explicit cycle.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        result = shortest_path.bellman_ford(
            graph, request.source, request.detect_negative_cycle
        )

        return BellmanFordResponse(
            snapshot_id=snapshot_id,
            source=request.source,
            negative_cycle_found=result.negative_cycle_found,
            cycle=result.cycle,
            distances=result.distances,
            paths=result.paths,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/floyd-warshall", response_model=FloydWarshallResponse)
async def run_floyd_warshall(request: FloydWarshallRequest):
    """
    Run Floyd-Warshall all-pairs shortest path algorithm.

    Supports both weight_cost and weight_neglog modes.
    Returns distance matrix and central node metric.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        result = all_pairs.floyd_warshall(graph, request.weight_mode)

        # Convert centrality to response format
        centrality_response = {}
        for node, data in result.centrality.items():
            centrality_response[node] = CentralityInfo(
                reachable_count=data["reachable_count"],
                sum_distance=data["sum_distance"],
            )

        return FloydWarshallResponse(
            snapshot_id=snapshot_id,
            weight_mode=request.weight_mode,
            node_order=result.node_order,
            distance_matrix=result.distance_matrix,
            central_node=result.central_node,
            centrality=centrality_response,
            centrality_note=result.centrality_note,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/mst/prim", response_model=MSTResponse)
async def run_mst_prim(request: MSTRequest):
    """
    Run Prim's MST algorithm on undirected graph projection.

    For disconnected graphs, returns spanning forest.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        # Convert to undirected graph
        undirected_graph = graph.to_undirected()

        result = mst.mst_prim(undirected_graph)

        # Convert edges to response format
        edges_response = [edge.to_dict() for edge in result.edges]

        return MSTResponse(
            snapshot_id=snapshot_id,
            algorithm="mst_prim",
            edges=edges_response,
            total_cost=result.total_cost,
            is_forest=result.is_forest,
            num_components=result.num_components,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/algorithms/mst/kruskal", response_model=MSTResponse)
async def run_mst_kruskal(request: MSTRequest):
    """
    Run Kruskal's MST algorithm on undirected graph projection.

    For disconnected graphs, returns spanning forest.
    """
    try:
        snapshot_id, graph = await load_graph_from_snapshot(
            request.snapshot_id, request.graph_payload
        )

        # Convert to undirected graph
        undirected_graph = graph.to_undirected()

        result = mst.mst_kruskal(undirected_graph)

        # Convert edges to response format
        edges_response = [edge.to_dict() for edge in result.edges]

        return MSTResponse(
            snapshot_id=snapshot_id,
            algorithm="mst_kruskal",
            edges=edges_response,
            total_cost=result.total_cost,
            is_forest=result.is_forest,
            num_components=result.num_components,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
