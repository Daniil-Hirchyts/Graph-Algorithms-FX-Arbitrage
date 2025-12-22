"""Minimum Spanning Tree algorithms: Prim and Kruskal."""

import heapq
from typing import Dict, List

from .graph import Graph


class MSTEdge:
    """Represents an edge in the MST."""

    def __init__(self, u: str, v: str, weight: float):
        # Normalize: always store u < v
        if u <= v:
            self.u = u
            self.v = v
        else:
            self.u = v
            self.v = u
        self.weight = weight

    def to_dict(self) -> Dict[str, any]:
        """Convert to dictionary for JSON serialization."""
        return {"u": self.u, "v": self.v, "weight": self.weight}


class MSTResult:
    """Result of MST algorithm."""

    def __init__(
        self,
        edges: List[MSTEdge],
        total_cost: float,
        is_forest: bool,
        num_components: int,
    ):
        self.edges = edges
        self.total_cost = total_cost
        self.is_forest = is_forest
        self.num_components = num_components


class UnionFind:
    """Union-Find (Disjoint Set Union) data structure."""

    def __init__(self, nodes: List[str]):
        """
        Initialize Union-Find structure.

        Args:
            nodes: List of node identifiers
        """
        self.parent = {node: node for node in nodes}
        self.rank = {node: 0 for node in nodes}

    def find(self, x: str) -> str:
        """
        Find root of node x with path compression.

        Args:
            x: Node identifier

        Returns:
            Root of the set containing x
        """
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x: str, y: str) -> bool:
        """
        Union sets containing x and y.

        Args:
            x: First node
            y: Second node

        Returns:
            True if union was performed, False if already in same set
        """
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return False  # Already in same set

        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        return True


def mst_prim(graph: Graph) -> MSTResult:
    """
    Prim's MST algorithm on undirected graph.

    For disconnected graphs, runs Prim on each component to produce a forest.

    Complexity: O(E log V)

    Args:
        graph: Undirected graph (should be converted using to_undirected())

    Returns:
        MSTResult with edges, total cost, and forest information
    """
    if graph.directed:
        # Convert to undirected if needed
        graph = graph.to_undirected()

    nodes = graph.nodes
    visited = set()
    mst_edges: List[MSTEdge] = []
    total_cost = 0.0
    num_components = 0

    # Process each component
    for start_node in sorted(nodes):  # Process in sorted order for determinism
        if start_node in visited:
            continue

        num_components += 1
        component_edges = _prim_component(graph, start_node, visited)
        mst_edges.extend(component_edges)

        for edge in component_edges:
            total_cost += edge.weight

    # Sort edges for deterministic output
    mst_edges.sort(key=lambda e: (e.u, e.v))

    is_forest = num_components > 1

    return MSTResult(
        edges=mst_edges,
        total_cost=total_cost,
        is_forest=is_forest,
        num_components=num_components,
    )


def _prim_component(
    graph: Graph, start: str, visited: set
) -> List[MSTEdge]:
    """
    Run Prim's algorithm on a single connected component.

    Args:
        graph: Undirected graph
        start: Starting node for this component
        visited: Set of already visited nodes (updated in place)

    Returns:
        List of MST edges for this component
    """
    component_edges: List[MSTEdge] = []
    pq: List[tuple] = []  # (weight, u, v)

    # Add start node
    visited.add(start)

    # Add all edges from start node
    for edge in graph.get_neighbors(start):
        if edge.to not in visited:
            heapq.heappush(pq, (edge.weight_cost, start, edge.to))

    # Process edges
    while pq:
        weight, u, v = heapq.heappop(pq)

        if v in visited:
            continue

        # Add edge to MST
        visited.add(v)
        component_edges.append(MSTEdge(u, v, weight))

        # Add edges from newly added node
        for edge in graph.get_neighbors(v):
            if edge.to not in visited:
                heapq.heappush(pq, (edge.weight_cost, v, edge.to))

    return component_edges


def mst_kruskal(graph: Graph) -> MSTResult:
    """
    Kruskal's MST algorithm on undirected graph.

    For disconnected graphs, produces a spanning forest.

    Complexity: O(E log E)

    Args:
        graph: Undirected graph (should be converted using to_undirected())

    Returns:
        MSTResult with edges, total cost, and forest information
    """
    if graph.directed:
        # Convert to undirected if needed
        graph = graph.to_undirected()

    nodes = graph.nodes
    uf = UnionFind(nodes)

    # Collect all edges and sort by (weight, u, v) where u < v
    edges: List[tuple] = []
    seen_edges = set()

    for u in nodes:
        for edge in graph.get_neighbors(u):
            v = edge.to
            # Normalize edge representation
            edge_key = (u, v) if u < v else (v, u)

            if edge_key not in seen_edges:
                seen_edges.add(edge_key)
                edges.append((edge.weight_cost, edge_key[0], edge_key[1]))

    # Sort by (weight, u, v) for determinism
    edges.sort()

    # Build MST using Kruskal's algorithm
    mst_edges: List[MSTEdge] = []
    total_cost = 0.0

    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append(MSTEdge(u, v, weight))
            total_cost += weight

    # Count components
    components = len(set(uf.find(node) for node in nodes))
    is_forest = components > 1

    # Sort edges for deterministic output
    mst_edges.sort(key=lambda e: (e.u, e.v))

    return MSTResult(
        edges=mst_edges,
        total_cost=total_cost,
        is_forest=is_forest,
        num_components=components,
    )

