"""Graph traversal algorithms: BFS and DFS."""

from collections import deque
from typing import Dict, List, Optional

from .graph import Graph


class BFSResult:
    def __init__(
        self,
        order: List[str],
        parent: Dict[str, Optional[str]],
        depth: Dict[str, int],
    ):
        self.order = order
        self.parent = parent
        self.depth = depth


class DFSResult:
    def __init__(
        self,
        order: List[str],
        parent: Dict[str, Optional[str]],
        discovery_time: Dict[str, int],
        finish_time: Dict[str, int],
    ):
        self.order = order
        self.parent = parent
        self.discovery_time = discovery_time
        self.finish_time = finish_time


def bfs(graph: Graph, start: str) -> BFSResult:
    if start not in graph.nodes:
        raise ValueError(f"Start node '{start}' not in graph")

    order = []
    parent: Dict[str, Optional[str]] = {start: None}
    depth: Dict[str, int] = {start: 0}
    queue = deque([start])

    while queue:
        u = queue.popleft()
        order.append(u)

        for edge in graph.get_neighbors(u):
            v = edge.to
            if v not in parent:
                parent[v] = u
                depth[v] = depth[u] + 1
                queue.append(v)

    return BFSResult(order=order, parent=parent, depth=depth)


def dfs(graph: Graph, start: str) -> DFSResult:
    if start not in graph.nodes:
        raise ValueError(f"Start node '{start}' not in graph")

    order = []
    parent: Dict[str, Optional[str]] = {start: None}
    discovery_time: Dict[str, int] = {}
    finish_time: Dict[str, int] = {}

    visited = set()
    time = [0]

    def dfs_visit(u: str) -> None:
        time[0] += 1
        discovery_time[u] = time[0]
        visited.add(u)
        order.append(u)

        for edge in graph.get_neighbors(u):
            v = edge.to
            if v not in visited:
                parent[v] = u
                dfs_visit(v)

        time[0] += 1
        finish_time[u] = time[0]

    dfs_visit(start)

    return DFSResult(
        order=order,
        parent=parent,
        discovery_time=discovery_time,
        finish_time=finish_time,
    )
