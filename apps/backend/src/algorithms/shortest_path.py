"""Shortest path algorithms: Dijkstra and Bellman-Ford."""

import heapq
from typing import Dict, List, Optional

from .graph import Graph


class DijkstraResult:
    def __init__(
        self,
        distances: Dict[str, Optional[float]],
        paths: Dict[str, List[str]],
        found: bool = True,
    ):
        self.distances = distances
        self.paths = paths
        self.found = found


class BellmanFordResult:
    def __init__(
        self,
        negative_cycle_found: bool,
        cycle: Optional[List[str]],
        distances: Dict[str, Optional[float]],
        paths: Dict[str, List[str]],
    ):
        self.negative_cycle_found = negative_cycle_found
        self.cycle = cycle
        self.distances = distances
        self.paths = paths


def dijkstra(graph: Graph, source: str, target: Optional[str] = None) -> DijkstraResult:
    if source not in graph.nodes:
        raise ValueError(f"Source node '{source}' not in graph")

    distances: Dict[str, float] = {source: 0.0}
    parent: Dict[str, Optional[str]] = {source: None}
    visited = set()

    pq = [(0.0, source)]

    while pq:
        dist_u, u = heapq.heappop(pq)

        if u in visited:
            continue

        visited.add(u)

        if target and u == target:
            break

        for edge in graph.get_neighbors(u):
            v = edge.to
            if v in visited:
                continue

            new_dist = dist_u + edge.weight_cost

            if v not in distances or new_dist < distances[v]:
                distances[v] = new_dist
                parent[v] = u
                heapq.heappush(pq, (new_dist, v))

    paths: Dict[str, List[str]] = {}
    for node in distances:
        if node == source:
            paths[node] = [source]
        else:
            path = []
            current = node
            while current is not None:
                path.append(current)
                current = parent.get(current)
            paths[node] = list(reversed(path))

    all_distances: Dict[str, Optional[float]] = {}
    for node in graph.nodes:
        all_distances[node] = distances.get(node)

    if target:
        found = target in distances
        return DijkstraResult(distances=all_distances, paths=paths, found=found)

    return DijkstraResult(distances=all_distances, paths=paths, found=True)


def bellman_ford(
    graph: Graph, source: str, detect_negative_cycle: bool = True
) -> BellmanFordResult:
    if source not in graph.nodes:
        raise ValueError(f"Source node '{source}' not in graph")

    n = len(graph.nodes)
    distances: Dict[str, float] = {source: 0.0}
    parent: Dict[str, Optional[str]] = {source: None}

    for _ in range(n - 1):
        updated = False
        for u in graph.nodes:
            if u not in distances:
                continue

            for edge in graph.get_neighbors(u):
                v = edge.to
                new_dist = distances[u] + edge.weight_neglog

                if v not in distances or new_dist < distances[v]:
                    distances[v] = new_dist
                    parent[v] = u
                    updated = True

        if not updated:
            break

    negative_cycle_found = False
    cycle: Optional[List[str]] = None

    if detect_negative_cycle:
        cycle_node = None
        for u in graph.nodes:
            if u not in distances:
                continue

            for edge in graph.get_neighbors(u):
                v = edge.to
                if v not in distances:
                    continue

                new_dist = distances[u] + edge.weight_neglog
                if new_dist < distances[v]:
                    negative_cycle_found = True
                    cycle_node = v
                    parent[v] = u
                    break

            if negative_cycle_found:
                break

        if negative_cycle_found and cycle_node:
            cycle = _extract_cycle(parent, cycle_node, n)

    paths: Dict[str, List[str]] = {}
    if not negative_cycle_found:
        for node in distances:
            if node == source:
                paths[node] = [source]
            else:
                path = []
                current = node
                visited_in_path = set()
                while current is not None and current not in visited_in_path:
                    path.append(current)
                    visited_in_path.add(current)
                    current = parent.get(current)
                paths[node] = list(reversed(path))

    if not negative_cycle_found:
        all_distances: Dict[str, Optional[float]] = {
            node: distances.get(node) for node in graph.nodes
        }
    else:
        all_distances = {}

    return BellmanFordResult(
        negative_cycle_found=negative_cycle_found,
        cycle=cycle,
        distances=all_distances,
        paths=paths,
    )


def _extract_cycle(
    parent: Dict[str, Optional[str]], start_node: str, n: int
) -> List[str]:
    current = start_node
    for _ in range(n):
        current = parent.get(current, current)

    cycle = [current]
    next_node = parent.get(current)

    while next_node != current and next_node is not None:
        cycle.append(next_node)
        next_node = parent.get(next_node)

    cycle.reverse()

    if cycle:
        min_idx = cycle.index(min(cycle))
        cycle = cycle[min_idx:] + cycle[:min_idx]
        cycle.append(cycle[0])

    return cycle
