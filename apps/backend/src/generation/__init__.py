"""Graph dataset generation."""

from .generator import GraphDataGenerator
from .scenarios import (
    get_available_scenarios,
    scenario_balanced_tree,
    scenario_dense_graph,
    scenario_disconnected_components,
    scenario_hub_and_spoke,
    scenario_linear_chain,
    scenario_negative_cycle,
    scenario_sparse_graph,
)

__all__ = [
    "GraphDataGenerator",
    "get_available_scenarios",
    "scenario_negative_cycle",
    "scenario_balanced_tree",
    "scenario_dense_graph",
    "scenario_disconnected_components",
    "scenario_hub_and_spoke",
    "scenario_linear_chain",
    "scenario_sparse_graph",
]
