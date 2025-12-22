"""Tests for API endpoints."""

from types import SimpleNamespace
from unittest.mock import patch

from fastapi.testclient import TestClient

from src.main import app
from src.models import GeneratedDataset, GraphMetadata, GraphNode, GraphPayload

client = TestClient(app)


class TestHealthEndpoint:
    @patch("src.api.health.graph_cache")
    def test_health_check(self, mock_cache):
        mock_cache.latest.return_value = (
            "id",
            SimpleNamespace(timestamp="2025-01-12T14:30:22Z"),
        )
        mock_cache.size.return_value = 1

        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["latest_snapshot"] == "2025-01-12T14:30:22Z"
        assert data["snapshot_count"] == 1


class TestGenerateEndpoint:
    @patch("src.api.generate.GraphDataGenerator")
    @patch("src.api.generate.GraphBuilder")
    def test_generate_success(self, mock_graph_builder, mock_generator):
        mock_gen_instance = mock_generator.return_value
        mock_dataset = GeneratedDataset(
            dataset_type="random",
            scenario_id=None,
            generation_params={},
            node_values={"A": 1.0, "B": 0.92},
            timestamp="2025-01-12T14:30:22Z",
            nodes=["A", "B"],
            anchor_node="A",
        )
        mock_gen_instance.generate_random_values.return_value = mock_dataset

        mock_gb_instance = mock_graph_builder.return_value
        mock_graph_payload = GraphPayload(
            nodes=[GraphNode(id="A"), GraphNode(id="B")],
            edges=[],
            metadata=GraphMetadata(node_count=2, edge_count=0),
        )
        mock_gb_instance.build_graph.return_value = mock_graph_payload

        response = client.post("/generate")

        assert response.status_code == 201
        data = response.json()
        assert data["dataset_type"] == "random"
        assert "graph_payload" in data

    def test_generate_invalid_node(self):
        response = client.post(
            "/generate",
            json={"nodes": ["A", ""]},
        )

        assert response.status_code == 400
        assert "Node ids" in response.json()["detail"]
