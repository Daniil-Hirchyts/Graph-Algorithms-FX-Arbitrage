"""Unit tests for graph algorithms."""

import pytest

from src.algorithms import all_pairs, mst, shortest_path, traversal
from src.algorithms.graph import Graph


class TestGraph:
    """Tests for Graph class."""

    def test_from_graph_payload(self):
        """Test creating Graph from graph_payload."""
        payload = {
            "nodes": [{"id": "USD"}, {"id": "EUR"}, {"id": "GBP"}],
            "edges": [
                {
                    "from": "USD",
                    "to": "EUR",
                    "weight_cost": 10.0,
                    "weight_neglog": 0.1,
                },
                {
                    "from": "EUR",
                    "to": "GBP",
                    "weight_cost": 15.0,
                    "weight_neglog": 0.15,
                },
            ],
        }

        graph = Graph.from_graph_payload(payload, directed=True)

        assert len(graph.nodes) == 3
        assert set(graph.nodes) == {"EUR", "GBP", "USD"}  # Sorted
        assert len(graph.get_neighbors("USD")) == 1
        assert len(graph.get_neighbors("EUR")) == 1

    def test_to_undirected(self):
        """Test converting directed graph to undirected."""
        nodes = ["USD", "EUR"]
        edges = [
            ("USD", "EUR", 10.0, 0.1),
            ("EUR", "USD", 20.0, 0.2),
        ]

        directed = Graph(nodes, edges, directed=True)
        undirected = directed.to_undirected()

        assert not undirected.directed
        # Should have 2 neighbors for each (bidirectional)
        assert len(undirected.get_neighbors("USD")) == 1
        assert len(undirected.get_neighbors("EUR")) == 1

        # Should use minimum weight (10.0)
        weight = undirected.get_weight("USD", "EUR", "cost")
        assert weight == 10.0


class TestBFS:
    """Tests for BFS algorithm."""

    def test_bfs_simple_graph(self):
        """Test BFS on simple connected graph."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 1.0, 0.1),
            ("A", "C", 1.0, 0.1),
            ("B", "C", 1.0, 0.1),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = traversal.bfs(graph, "A")

        assert result.order[0] == "A"
        assert set(result.order) == {"A", "B", "C"}
        assert result.parent["A"] is None
        assert result.depth["A"] == 0
        assert result.depth["B"] == 1
        assert result.depth["C"] == 1

    def test_bfs_unreachable_nodes(self):
        """Test BFS with unreachable nodes."""
        nodes = ["A", "B", "C"]
        edges = [("A", "B", 1.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        result = traversal.bfs(graph, "A")

        assert set(result.order) == {"A", "B"}
        assert "C" not in result.parent
        assert "C" not in result.depth

    def test_bfs_invalid_start(self):
        """Test BFS with invalid start node."""
        nodes = ["A", "B"]
        edges = [("A", "B", 1.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        with pytest.raises(ValueError, match="not in graph"):
            traversal.bfs(graph, "X")


class TestDFS:
    """Tests for DFS algorithm."""

    def test_dfs_simple_graph(self):
        """Test DFS on simple connected graph."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 1.0, 0.1),
            ("A", "C", 1.0, 0.1),
            ("B", "C", 1.0, 0.1),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = traversal.dfs(graph, "A")

        assert result.order[0] == "A"
        assert set(result.order) == {"A", "B", "C"}
        assert result.parent["A"] is None

        # Discovery time should be before finish time
        for node in result.order:
            assert result.discovery_time[node] < result.finish_time[node]

    def test_dfs_invalid_start(self):
        """Test DFS with invalid start node."""
        nodes = ["A", "B"]
        edges = [("A", "B", 1.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        with pytest.raises(ValueError, match="not in graph"):
            traversal.dfs(graph, "X")


class TestDijkstra:
    """Tests for Dijkstra algorithm."""

    def test_dijkstra_simple_path(self):
        """Test Dijkstra finding shortest path."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
            ("A", "C", 30.0, 0.3),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.dijkstra(graph, "A", "C")

        assert result.found
        assert result.distances["C"] == 25.0  # A -> B -> C
        assert result.paths["C"] == ["A", "B", "C"]

    def test_dijkstra_unreachable_target(self):
        """Test Dijkstra with unreachable target."""
        nodes = ["A", "B", "C"]
        edges = [("A", "B", 10.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.dijkstra(graph, "A", "C")

        assert not result.found
        assert result.distances["C"] is None

    def test_dijkstra_all_nodes(self):
        """Test Dijkstra without target (to all nodes)."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("A", "C", 20.0, 0.2),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.dijkstra(graph, "A")

        assert result.distances["A"] == 0.0
        assert result.distances["B"] == 10.0
        assert result.distances["C"] == 20.0


class TestBellmanFord:
    """Tests for Bellman-Ford algorithm."""

    def test_bellman_ford_no_cycle(self):
        """Test Bellman-Ford without negative cycle."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.bellman_ford(graph, "A")

        assert not result.negative_cycle_found
        assert result.cycle is None
        assert result.distances["B"] == 0.1
        assert result.distances["C"] == 0.25

    def test_bellman_ford_negative_cycle(self):
        """Test Bellman-Ford detecting negative cycle."""
        nodes = ["A", "B", "C"]
        # Create a negative cycle: A -> B -> C -> A with negative total weight
        edges = [
            ("A", "B", 10.0, -0.5),
            ("B", "C", 10.0, -0.5),
            ("C", "A", 10.0, -0.5),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.bellman_ford(graph, "A")

        assert result.negative_cycle_found
        assert result.cycle is not None
        assert len(result.cycle) >= 2
        assert result.cycle[0] == result.cycle[-1]  # First == last

    def test_bellman_ford_unreachable(self):
        """Test Bellman-Ford with unreachable nodes."""
        nodes = ["A", "B", "C"]
        edges = [("A", "B", 10.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        result = shortest_path.bellman_ford(graph, "A")

        assert not result.negative_cycle_found
        assert result.distances["C"] is None


class TestFloydWarshall:
    """Tests for Floyd-Warshall algorithm."""

    def test_floyd_warshall_complete_graph(self):
        """Test Floyd-Warshall on complete graph."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
            ("A", "C", 30.0, 0.3),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = all_pairs.floyd_warshall(graph, "cost")

        assert result.node_order == ["A", "B", "C"]
        assert result.distance_matrix["A"]["A"] == 0.0
        assert result.distance_matrix["A"]["B"] == 10.0
        assert result.distance_matrix["A"]["C"] == 25.0  # via B

    def test_floyd_warshall_unreachable(self):
        """Test Floyd-Warshall with unreachable pairs."""
        nodes = ["A", "B", "C"]
        edges = [("A", "B", 10.0, 0.1)]
        graph = Graph(nodes, edges, directed=True)

        result = all_pairs.floyd_warshall(graph, "cost")

        assert result.distance_matrix["A"]["C"] is None
        assert result.distance_matrix["B"]["C"] is None

    def test_floyd_warshall_centrality(self):
        """Test Floyd-Warshall central node calculation."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "A", 10.0, 0.1),
            ("B", "C", 10.0, 0.1),
            ("C", "B", 10.0, 0.1),
        ]
        graph = Graph(nodes, edges, directed=True)

        result = all_pairs.floyd_warshall(graph, "cost")

        # B should be most central (reaches both A and C directly)
        assert result.central_node == "B"
        assert result.centrality["B"]["reachable_count"] == 2


class TestMST:
    """Tests for MST algorithms."""

    def test_prim_connected_graph(self):
        """Test Prim on connected graph."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "A", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
            ("C", "B", 15.0, 0.15),
            ("A", "C", 30.0, 0.3),
            ("C", "A", 30.0, 0.3),
        ]
        graph = Graph(nodes, edges, directed=False)

        result = mst.mst_prim(graph)

        assert not result.is_forest
        assert result.num_components == 1
        assert len(result.edges) == 2  # MST has n-1 edges
        assert result.total_cost == 25.0  # 10 + 15

    def test_kruskal_connected_graph(self):
        """Test Kruskal on connected graph."""
        nodes = ["A", "B", "C"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
            ("A", "C", 30.0, 0.3),
        ]
        graph = Graph(nodes, edges, directed=False)

        result = mst.mst_kruskal(graph)

        assert not result.is_forest
        assert result.num_components == 1
        assert len(result.edges) == 2
        assert result.total_cost == 25.0

    def test_prim_disconnected_graph(self):
        """Test Prim on disconnected graph (forest)."""
        nodes = ["A", "B", "C", "D"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("C", "D", 20.0, 0.2),
        ]
        graph = Graph(nodes, edges, directed=False)

        result = mst.mst_prim(graph)

        assert result.is_forest
        assert result.num_components == 2
        assert len(result.edges) == 2  # Two components, each with 1 edge

    def test_kruskal_disconnected_graph(self):
        """Test Kruskal on disconnected graph (forest)."""
        nodes = ["A", "B", "C", "D"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("C", "D", 20.0, 0.2),
        ]
        graph = Graph(nodes, edges, directed=False)

        result = mst.mst_kruskal(graph)

        assert result.is_forest
        assert result.num_components == 2

    def test_prim_kruskal_same_result(self):
        """Test that Prim and Kruskal produce same total cost."""
        nodes = ["A", "B", "C", "D"]
        edges = [
            ("A", "B", 10.0, 0.1),
            ("B", "C", 15.0, 0.15),
            ("C", "D", 20.0, 0.2),
            ("A", "D", 50.0, 0.5),
        ]
        graph = Graph(nodes, edges, directed=False)

        prim_result = mst.mst_prim(graph)
        kruskal_result = mst.mst_kruskal(graph)

        assert prim_result.total_cost == kruskal_result.total_cost
        assert len(prim_result.edges) == len(kruskal_result.edges)
