"""All-pairs shortest path algorithms: Floyd-Warshall."""

from typing import Dict, List, Literal, Optional, Tuple

from .graph import Graph


class FloydWarshallResult:
    def __init__(
        self,
        node_order: List[str],
        distance_matrix: Dict[str, Dict[str, Optional[float]]],
        central_node: Optional[str],
        centrality: Dict[str, Dict[str, float]],
        centrality_note: str,
    ):
        self.node_order = node_order
        self.distance_matrix = distance_matrix
        self.central_node = central_node
        self.centrality = centrality
        self.centrality_note = centrality_note


def floyd_warshall(
    graph: Graph, weight_mode: Literal["cost", "neglog"] = "cost"
) -> FloydWarshallResult:
    nodes = sorted(graph.nodes)
    n = len(nodes)

    INF = float("inf")
    dist = [[INF for _ in range(n)] for _ in range(n)]

    node_to_idx = {node: i for i, node in enumerate(nodes)}

    for i, u in enumerate(nodes):
        dist[i][i] = 0.0

        for edge in graph.get_neighbors(u):
            v = edge.to
            j = node_to_idx[v]
            weight = edge.weight_cost if weight_mode == "cost" else edge.weight_neglog
            dist[i][j] = weight

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

    distance_matrix: Dict[str, Dict[str, Optional[float]]] = {}
    for i, u in enumerate(nodes):
        distance_matrix[u] = {}
        for j, v in enumerate(nodes):
            distance_matrix[u][v] = None if dist[i][j] == INF else dist[i][j]

    central_node, centrality = _calculate_centrality(nodes, dist)

    centrality_note = (
        "Central node determined by: "
        "(1) maximize reachable_count, "
        "(2) minimize sum_distance (finite only)"
    )

    return FloydWarshallResult(
        node_order=nodes,
        distance_matrix=distance_matrix,
        central_node=central_node,
        centrality=centrality,
        centrality_note=centrality_note,
    )


def _calculate_centrality(
    nodes: List[str], dist: List[List[float]]
) -> Tuple[Optional[str], Dict[str, Dict[str, float]]]:
    INF = float("inf")
    n = len(nodes)

    centrality: Dict[str, Dict[str, float]] = {}
    best_node: Optional[str] = None
    best_reachable_count = -1
    best_sum_distance = INF

    for i, u in enumerate(nodes):
        reachable_count = 0
        sum_distance = 0.0

        for j, _ in enumerate(nodes):
            if i != j and dist[i][j] != INF:
                reachable_count += 1
                sum_distance += dist[i][j]

        centrality[u] = {
            "reachable_count": reachable_count,
            "sum_distance": sum_distance if reachable_count > 0 else None,
        }

        if reachable_count > best_reachable_count:
            best_node = u
            best_reachable_count = reachable_count
            best_sum_distance = sum_distance
        elif reachable_count == best_reachable_count and reachable_count > 0:
            if sum_distance < best_sum_distance:
                best_node = u
                best_sum_distance = sum_distance

    if best_reachable_count == 0:
        best_node = None

    return best_node, centrality
