"""Integration tests for algorithm API endpoints."""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def graph_payload():
    return {
        "nodes": [{"id": "A"}, {"id": "B"}, {"id": "C"}],
        "edges": [
            {"from": "A", "to": "B", "weight_cost": 1.0, "weight_neglog": 0.1},
            {"from": "A", "to": "C", "weight_cost": 2.0, "weight_neglog": 0.2},
            {"from": "B", "to": "A", "weight_cost": 1.2, "weight_neglog": 0.12},
            {"from": "B", "to": "C", "weight_cost": 1.5, "weight_neglog": 0.15},
            {"from": "C", "to": "A", "weight_cost": 2.1, "weight_neglog": 0.21},
            {"from": "C", "to": "B", "weight_cost": 1.6, "weight_neglog": 0.16},
        ],
        "metadata": {
            "node_count": 3,
            "edge_count": 6,
        },
    }


@pytest.fixture
def client():
    return TestClient(app)


class TestAlgorithmEndpoints:
    def test_bfs_endpoint(self, client, graph_payload):
        response = client.post(
            "/algorithms/bfs", json={"start_node": "A", "graph_payload": graph_payload}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "bfs"
        assert data["start_node"] == "A"
        assert "order" in data
        assert "parent" in data
        assert "depth" in data
        assert data["order"][0] == "A"

    def test_dfs_endpoint(self, client, graph_payload):
        response = client.post(
            "/algorithms/dfs", json={"start_node": "A", "graph_payload": graph_payload}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "dfs"
        assert data["start_node"] == "A"
        assert "order" in data
        assert "parent" in data
        assert "discovery_time" in data
        assert "finish_time" in data

    def test_dijkstra_endpoint_with_target(self, client, graph_payload):
        response = client.post(
            "/algorithms/dijkstra",
            json={"source": "A", "target": "C", "graph_payload": graph_payload},
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "dijkstra"
        assert data["source"] == "A"
        assert data["target"] == "C"
        assert data["found"] is True
        assert data["distance"] is not None
        assert len(data["path"]) >= 2

    def test_dijkstra_endpoint_without_target(self, client, graph_payload):
        response = client.post(
            "/algorithms/dijkstra",
            json={"source": "A", "graph_payload": graph_payload},
        )

        assert response.status_code == 200
        data = response.json()

        assert data["source"] == "A"
        assert "all_distances" in data
        assert "A" in data["all_distances"]
        assert "B" in data["all_distances"]
        assert "C" in data["all_distances"]

    def test_bellman_ford_endpoint(self, client, graph_payload):
        response = client.post(
            "/algorithms/bellman-ford",
            json={
                "source": "A",
                "detect_negative_cycle": True,
                "graph_payload": graph_payload,
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "bellman_ford"
        assert data["source"] == "A"
        assert "negative_cycle_found" in data
        assert "cycle" in data
        assert "distances" in data

    def test_floyd_warshall_endpoint_cost(self, client, graph_payload):
        response = client.post(
            "/algorithms/floyd-warshall",
            json={"weight_mode": "cost", "graph_payload": graph_payload},
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "floyd_warshall"
        assert data["weight_mode"] == "cost"
        assert "node_order" in data
        assert "distance_matrix" in data
        assert "central_node" in data
        assert "centrality" in data

        assert "A" in data["distance_matrix"]
        assert "B" in data["distance_matrix"]["A"]

    def test_floyd_warshall_endpoint_neglog(self, client, graph_payload):
        response = client.post(
            "/algorithms/floyd-warshall",
            json={"weight_mode": "neglog", "graph_payload": graph_payload},
        )

        assert response.status_code == 200
        data = response.json()

        assert data["weight_mode"] == "neglog"
        assert "central_node" in data

    def test_mst_prim_endpoint(self, client, graph_payload):
        response = client.post(
            "/algorithms/mst/prim", json={"graph_payload": graph_payload}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "mst_prim"
        assert "edges" in data
        assert "total_cost" in data
        assert "is_forest" in data
        assert "num_components" in data

        assert len(data["edges"]) == 2

    def test_mst_kruskal_endpoint(self, client, graph_payload):
        response = client.post(
            "/algorithms/mst/kruskal", json={"graph_payload": graph_payload}
        )

        assert response.status_code == 200
        data = response.json()

        assert data["algorithm"] == "mst_kruskal"
        assert "edges" in data
        assert len(data["edges"]) == 2

    def test_invalid_start_node(self, client):
        response = client.post(
            "/algorithms/bfs",
            json={
                "start_node": "Z",
                "graph_payload": {
                    "nodes": [{"id": "A"}, {"id": "B"}],
                    "edges": [
                        {"from": "A", "to": "B", "weight_cost": 1.0, "weight_neglog": 0.1}
                    ],
                    "metadata": {"node_count": 2, "edge_count": 1},
                },
            },
        )

        assert response.status_code == 400

    def test_missing_snapshot_id(self, client):
        response = client.post(
            "/algorithms/bfs",
            json={"snapshot_id": "nonexistent", "start_node": "A"},
        )

        assert response.status_code == 404

    def test_graph_payload_required(self, client):
        response = client.post("/algorithms/bfs", json={"start_node": "A"})

        assert response.status_code == 400
        assert "graph_payload is required" in response.json()["detail"]

    def test_prim_kruskal_same_cost(self, client, graph_payload):
        prim_response = client.post(
            "/algorithms/mst/prim", json={"graph_payload": graph_payload}
        )
        kruskal_response = client.post(
            "/algorithms/mst/kruskal", json={"graph_payload": graph_payload}
        )

        assert prim_response.status_code == 200
        assert kruskal_response.status_code == 200

        prim_cost = prim_response.json()["total_cost"]
        kruskal_cost = kruskal_response.json()["total_cost"]

        assert prim_cost == kruskal_cost
