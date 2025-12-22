"""Internal graph representation for algorithm execution."""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple


@dataclass
class Edge:
    to: str
    weight_cost: float
    weight_neglog: float


class Graph:
    def __init__(
        self,
        nodes: List[str],
        edges: List[Tuple[str, str, float, float]],
        directed: bool = True,
    ):
        self.nodes = sorted(set(nodes))
        self.directed = directed
        self.adj: Dict[str, List[Edge]] = {node: [] for node in self.nodes}

        for source, target, w_cost, w_neglog in edges:
            if source not in self.adj:
                raise ValueError(f"Unknown node in edge: {source}")
            if target not in self.adj:
                raise ValueError(f"Unknown node in edge: {target}")

            self.adj[source].append(
                Edge(to=target, weight_cost=w_cost, weight_neglog=w_neglog)
            )

            if not directed:
                self.adj[target].append(
                    Edge(to=source, weight_cost=w_cost, weight_neglog=w_neglog)
                )

        for node in self.adj:
            self.adj[node].sort(key=lambda e: e.to)

    def get_neighbors(self, node: str) -> List[Edge]:
        return self.adj.get(node, [])

    def get_weight(
        self, u: str, v: str, weight_type: str = "cost"
    ) -> Optional[float]:
        for edge in self.adj.get(u, []):
            if edge.to == v:
                return edge.weight_cost if weight_type == "cost" else edge.weight_neglog
        return None

    def get_all_edges(self, weight_type: str = "cost") -> List[Tuple[str, str, float]]:
        edges = []
        for u in self.nodes:
            for edge in self.adj[u]:
                weight = edge.weight_cost if weight_type == "cost" else edge.weight_neglog
                edges.append((u, edge.to, weight))
        return edges

    @staticmethod
    def from_graph_payload(graph_payload: dict, directed: bool = True) -> "Graph":
        nodes = [node["id"] for node in graph_payload["nodes"]]

        edges = [
            (
                edge["from"],
                edge["to"],
                edge["weight_cost"],
                edge["weight_neglog"],
            )
            for edge in graph_payload["edges"]
        ]

        return Graph(nodes, edges, directed=directed)

    def to_undirected(self) -> "Graph":
        if not self.directed:
            return self

        edge_map: Dict[Tuple[str, str], Tuple[float, float]] = {}

        for u in self.nodes:
            for edge in self.adj[u]:
                v = edge.to
                key = (u, v) if u < v else (v, u)

                if key not in edge_map:
                    edge_map[key] = (edge.weight_cost, edge.weight_neglog)
                else:
                    existing_cost, existing_neglog = edge_map[key]
                    min_cost = min(existing_cost, edge.weight_cost)
                    min_neglog = min(existing_neglog, edge.weight_neglog)
                    edge_map[key] = (min_cost, min_neglog)

        undirected_edges = []
        for (u, v), (w_cost, w_neglog) in edge_map.items():
            undirected_edges.append((u, v, w_cost, w_neglog))

        return Graph(self.nodes, undirected_edges, directed=False)
