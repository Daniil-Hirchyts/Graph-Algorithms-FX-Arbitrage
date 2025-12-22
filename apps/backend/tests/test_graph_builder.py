"""Tests for graph builder and weight calculations."""

import math
import pytest

from src.graph.builder import GraphBuilder
from src.graph.weights import WeightCalculator
from src.models import CostModel


class TestWeightCalculator:
    def test_calculate_effective_value(self):
        raw_value = 0.92
        total_cost = 15

        effective_value = WeightCalculator.calculate_effective_value(
            raw_value, total_cost
        )

        expected = 0.92 * (1 - 15 / 10000)
        assert abs(effective_value - expected) < 1e-6

    def test_calculate_effective_value_invalid_cost(self):
        with pytest.raises(ValueError, match="would make value non-positive"):
            WeightCalculator.calculate_effective_value(1.0, 10000)

    def test_calculate_weight_cost(self):
        total_cost = 15
        weight_cost = WeightCalculator.calculate_weight_cost(total_cost)
        assert weight_cost == 15

    def test_calculate_weight_neglog(self):
        effective_value = 0.92
        weight_neglog = WeightCalculator.calculate_weight_neglog(effective_value)
        expected = -math.log(0.92)
        assert abs(weight_neglog - expected) < 1e-6

    def test_calculate_weight_neglog_invalid_value(self):
        with pytest.raises(ValueError, match="must be positive"):
            WeightCalculator.calculate_weight_neglog(0)

    def test_calculate_all_weights(self):
        raw_value = 0.92
        base_cost = 10
        extra_cost = 5

        total_cost, effective_value, weight_cost, weight_neglog = (
            WeightCalculator.calculate_all_weights(raw_value, base_cost, extra_cost)
        )

        assert total_cost == 15
        assert abs(effective_value - 0.91862) < 1e-5
        assert weight_cost == 15
        assert abs(weight_neglog - (-math.log(0.91862))) < 1e-5


class TestGraphBuilder:
    def test_build_pairs(self, sample_node_values):
        cost_model = CostModel(base_cost=10, extra_cost=5)
        builder = GraphBuilder(cost_model)

        nodes = ["A", "B", "C"]
        all_pairs = [
            ("A", "B"), ("B", "A"),
            ("A", "C"), ("C", "A"),
            ("B", "C"), ("C", "B"),
        ]
        graph = builder.build_graph(
            node_values=sample_node_values,
            nodes=nodes,
            pairs=all_pairs,
        )

        assert len(graph.nodes) == 3
        assert graph.metadata.node_count == 3
        assert len(graph.edges) == 6
        assert graph.metadata.edge_count == 6

        node_ids = {node.id for node in graph.nodes}
        assert node_ids == {"A", "B", "C"}

    def test_build_curated_pairs(self, sample_node_values, sample_pairs):
        cost_model = CostModel(base_cost=10, extra_cost=5)
        builder = GraphBuilder(cost_model)

        nodes_set = set()
        for source, target in sample_pairs:
            nodes_set.add(source)
            nodes_set.add(target)
        nodes = list(nodes_set)

        graph = builder.build_graph(
            node_values=sample_node_values,
            nodes=nodes,
            pairs=sample_pairs,
        )

        assert len(graph.edges) == len(sample_pairs)

        a_b_edge = next(
            (e for e in graph.edges if e.source == "A" and e.target == "B"),
            None,
        )
        assert a_b_edge is not None

    def test_edge_weights_calculation(self, sample_node_values):
        cost_model = CostModel(base_cost=10, extra_cost=5)
        builder = GraphBuilder(cost_model)

        nodes = ["A", "B"]
        graph = builder.build_graph(
            node_values=sample_node_values,
            nodes=nodes,
            pairs=[("A", "B"), ("B", "A")],
        )

        a_b_edge = next(
            e for e in graph.edges if e.source == "A" and e.target == "B"
        )

        raw_value = sample_node_values["B"] / sample_node_values["A"]
        value_factor = min(2.0, max(0.5, raw_value))
        base_cost = cost_model.base_cost * (0.7 + 0.6 * value_factor)
        extra_cost = cost_model.extra_cost * (0.8 + 0.4 / value_factor)
        total_cost = base_cost + extra_cost
        effective_value = raw_value * (1 - total_cost / 10000)

        assert a_b_edge.weight_cost == pytest.approx(total_cost)
        assert a_b_edge.weight_neglog == pytest.approx(-math.log(effective_value))

    def test_build_graph_missing_node(self, sample_node_values):
        cost_model = CostModel(base_cost=10, extra_cost=5)
        builder = GraphBuilder(cost_model)

        nodes = ["A", "B", "Z"]
        with pytest.raises(ValueError, match="Missing values"):
            builder.build_graph(
                node_values=sample_node_values,
                nodes=nodes,
                pairs=[("A", "B"), ("B", "A")],
            )

    def test_pairs_missing_node(self, sample_node_values):
        cost_model = CostModel(base_cost=10, extra_cost=5)
        builder = GraphBuilder(cost_model)

        nodes = ["A", "B"]
        graph = builder.build_graph(
            node_values=sample_node_values,
            nodes=nodes,
            pairs=[("A", "B"), ("B", "Z")],
        )

        assert len(graph.edges) == 1
        assert graph.edges[0].source == "A"
        assert graph.edges[0].target == "B"
