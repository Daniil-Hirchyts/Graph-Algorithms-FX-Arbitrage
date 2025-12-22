"""Tests for dataset generation."""

import pytest
from src.generation.generator import GraphDataGenerator
from src.generation.scenarios import get_scenario, get_available_scenarios


class TestGraphDataGenerator:
    def test_generate_random_values(self):
        generator = GraphDataGenerator(seed=42)
        nodes = ["USD", "EUR", "GBP", "JPY"]

        dataset = generator.generate_random_values(
            anchor_node="USD",
            nodes=nodes,
            value_min=0.5,
            value_max=2.0,
            variance="medium",
        )

        assert dataset.dataset_type == "random"
        assert dataset.anchor_node == "USD"
        assert len(dataset.node_values) == len(nodes)
        assert dataset.node_values["USD"] == 1.0

        for node, value in dataset.node_values.items():
            if node != "USD":
                assert value > 0
                assert 0.5 * 0.7 <= value <= 2.0 * 1.4

    def test_generate_random_values_reproducible(self):
        generator = GraphDataGenerator(seed=42)
        nodes = ["USD", "EUR", "GBP"]

        dataset = generator.generate_random_values("USD", nodes)

        assert dataset.node_values["USD"] == 1.0
        assert len(dataset.node_values) == 3
        assert all(value > 0 for value in dataset.node_values.values())

        for node in ["EUR", "GBP"]:
            assert 0.1 <= dataset.node_values[node] <= 20.0

    def test_generate_from_scenario(self):
        generator = GraphDataGenerator()
        values, info = get_scenario("hub_and_spoke")

        dataset = generator.generate_from_scenario(
            scenario_id="hub_and_spoke",
            scenario_values=values,
            anchor_node="USD",
            nodes=info.nodes,
        )

        assert dataset.dataset_type == "scenario"
        assert dataset.scenario_id == "hub_and_spoke"
        assert dataset.anchor_node == "USD"
        assert dataset.node_values == values

    def test_generate_custom_values(self):
        generator = GraphDataGenerator()
        custom_values = {
            "USD": 1.0,
            "EUR": 0.85,
            "GBP": 0.73,
        }
        nodes = ["USD", "EUR", "GBP"]

        dataset = generator.generate_custom_values(
            custom_values=custom_values,
            anchor_node="USD",
            nodes=nodes,
        )

        assert dataset.dataset_type == "custom"
        assert dataset.node_values == custom_values

    def test_variance_levels(self):
        generator = GraphDataGenerator(seed=42)
        nodes = ["USD", "EUR", "GBP"]

        low = generator.generate_random_values("USD", nodes, variance="low")
        medium = generator.generate_random_values("USD", nodes, variance="medium")
        high = generator.generate_random_values("USD", nodes, variance="high")

        for dataset in [low, medium, high]:
            assert dataset.node_values["USD"] == 1.0
            assert all(value > 0 for value in dataset.node_values.values())


class TestScenarios:
    def test_get_available_scenarios(self):
        scenarios = get_available_scenarios()

        assert len(scenarios) > 0
        assert all(hasattr(s, "name") for s in scenarios)
        assert all(hasattr(s, "display_name") for s in scenarios)
        assert all(hasattr(s, "nodes") for s in scenarios)

    def test_negative_cycle_scenario(self):
        values, info = get_scenario("negative_cycle")

        assert info.name == "negative_cycle"
        assert "USD" in info.nodes
        assert values["USD"] == 1.0
        assert len(info.pairs) > 0

    def test_hub_and_spoke_scenario(self):
        values, info = get_scenario("hub_and_spoke")

        assert info.name == "hub_and_spoke"
        assert values["USD"] == 1.0

        connected_nodes = set()
        for source, target in info.pairs:
            if source == "USD":
                connected_nodes.add(target)
            if target == "USD":
                connected_nodes.add(source)

        for node in info.nodes:
            if node != "USD":
                assert node in connected_nodes

    def test_sparse_graph_scenario(self):
        _, info = get_scenario("sparse_graph")

        assert info.name == "sparse_graph"
        assert len(info.pairs) < len(info.nodes) * (len(info.nodes) - 1)

    def test_dense_graph_scenario(self):
        _, info = get_scenario("dense_graph")

        assert info.name == "dense_graph"
        assert len(info.pairs) > len(info.nodes) * 2

    def test_invalid_scenario_raises_error(self):
        with pytest.raises(ValueError, match="Unknown scenario"):
            get_scenario("invalid_scenario_name")

    def test_all_scenarios_have_valid_values(self):
        scenarios = [
            "negative_cycle",
            "sparse_graph",
            "dense_graph",
            "hub_and_spoke",
            "disconnected_components",
            "balanced_tree",
            "linear_chain",
        ]

        for scenario_id in scenarios:
            values, info = get_scenario(scenario_id)

            assert values["USD"] == 1.0
            assert all(value > 0 for value in values.values())
            assert info.name == scenario_id
            assert len(info.nodes) > 0
            assert len(info.pairs) > 0
