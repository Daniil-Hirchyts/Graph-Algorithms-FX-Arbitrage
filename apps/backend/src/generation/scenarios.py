"""Preset graph scenarios."""

from typing import Dict, List, Tuple


class ScenarioInfo:
    def __init__(
        self,
        name: str,
        display_name: str,
        description: str,
        nodes: List[str],
        pairs: List[Tuple[str, str]],
    ):
        self.name = name
        self.display_name = display_name
        self.description = description
        self.nodes = nodes
        self.pairs = pairs


BASE_VALUES: Dict[str, float] = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.78,
    "JPY": 1.45,
    "CHF": 0.96,
    "CAD": 1.32,
    "AUD": 1.48,
    "NZD": 1.62,
    "SEK": 1.12,
    "NOK": 1.08,
    "SGD": 1.36,
    "HKD": 1.29,
    "MXN": 1.55,
    "BRL": 1.72,
    "INR": 1.2,
    "CNY": 1.14,
    "KRW": 1.31,
    "ZAR": 1.58,
    "PLN": 1.05,
    "CZK": 1.03,
    "TRY": 1.67,
    "AED": 0.98,
    "SAR": 0.99,
    "THB": 1.25,
    "MYR": 1.22,
    "IDR": 1.4,
    "PHP": 1.18,
}


def values_for(nodes: List[str]) -> Dict[str, float]:
    return {node: BASE_VALUES[node] for node in nodes}


def full_bidirectional_pairs(nodes: List[str]) -> List[Tuple[str, str]]:
    pairs: List[Tuple[str, str]] = []
    for i, n1 in enumerate(nodes):
        for n2 in nodes[i + 1 :]:
            pairs.extend([(n1, n2), (n2, n1)])
    return pairs


def scenario_negative_cycle() -> Tuple[Dict[str, float], ScenarioInfo]:
    core_nodes = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD"]
    extra_nodes = ["AUD", "NZD", "SEK", "NOK", "SGD"]
    nodes = core_nodes + extra_nodes

    pairs = full_bidirectional_pairs(core_nodes)
    for node in extra_nodes:
        pairs.extend([("USD", node), (node, "USD"), ("EUR", node), (node, "EUR")])

    info = ScenarioInfo(
        name="negative_cycle",
        display_name="Negative Cycle",
        description="Dense loop structure for testing cycle detection and path costs.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def scenario_sparse_graph() -> Tuple[Dict[str, float], ScenarioInfo]:
    nodes = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CHF",
        "CAD",
        "AUD",
        "NZD",
        "SEK",
        "NOK",
        "SGD",
        "HKD",
        "MXN",
    ]

    pairs = []
    for i in range(len(nodes) - 1):
        pairs.extend([(nodes[i], nodes[i + 1]), (nodes[i + 1], nodes[i])])

    info = ScenarioInfo(
        name="sparse_graph",
        display_name="Sparse Graph (Chain)",
        description="Minimal connections in a linear chain.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def scenario_dense_graph() -> Tuple[Dict[str, float], ScenarioInfo]:
    nodes = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CHF",
        "CAD",
        "AUD",
        "NZD",
        "SEK",
        "NOK",
        "SGD",
        "HKD",
    ]

    info = ScenarioInfo(
        name="dense_graph",
        display_name="Dense Graph",
        description="High density with most node pairs available.",
        nodes=nodes,
        pairs=full_bidirectional_pairs(nodes),
    )

    return values_for(nodes), info


def scenario_hub_and_spoke() -> Tuple[Dict[str, float], ScenarioInfo]:
    nodes = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CHF",
        "CAD",
        "AUD",
        "NZD",
        "SEK",
        "NOK",
        "SGD",
        "HKD",
        "MXN",
        "BRL",
    ]

    pairs = []
    for node in nodes:
        if node != "USD":
            pairs.extend([("USD", node), (node, "USD")])

    info = ScenarioInfo(
        name="hub_and_spoke",
        display_name="Hub & Spoke",
        description="Star topology centered on a single node.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def scenario_disconnected_components() -> Tuple[Dict[str, float], ScenarioInfo]:
    group_one = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD"]
    group_two = ["AUD", "NZD", "SEK", "NOK", "SGD", "HKD"]
    nodes = group_one + group_two

    pairs: List[Tuple[str, str]] = []
    for group in (group_one, group_two):
        for i in range(len(group)):
            src = group[i]
            dst = group[(i + 1) % len(group)]
            pairs.extend([(src, dst), (dst, src)])

    info = ScenarioInfo(
        name="disconnected_components",
        display_name="Disconnected Components",
        description="Two clusters with no edges between them.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def scenario_balanced_tree() -> Tuple[Dict[str, float], ScenarioInfo]:
    nodes = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CHF",
        "CAD",
        "AUD",
        "NZD",
        "SEK",
        "NOK",
        "SGD",
        "HKD",
        "MXN",
    ]

    pairs = [
        ("USD", "EUR"), ("EUR", "USD"),
        ("USD", "GBP"), ("GBP", "USD"),
        ("EUR", "JPY"), ("JPY", "EUR"),
        ("EUR", "CHF"), ("CHF", "EUR"),
        ("GBP", "CAD"), ("CAD", "GBP"),
        ("GBP", "AUD"), ("AUD", "GBP"),
        ("JPY", "NZD"), ("NZD", "JPY"),
        ("JPY", "SEK"), ("SEK", "JPY"),
        ("CHF", "NOK"), ("NOK", "CHF"),
        ("CHF", "SGD"), ("SGD", "CHF"),
        ("CAD", "HKD"), ("HKD", "CAD"),
        ("AUD", "MXN"), ("MXN", "AUD"),
    ]

    info = ScenarioInfo(
        name="balanced_tree",
        display_name="Balanced Tree",
        description="Hierarchical tree structure for traversal tests.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def scenario_linear_chain() -> Tuple[Dict[str, float], ScenarioInfo]:
    nodes = [
        "USD",
        "EUR",
        "GBP",
        "JPY",
        "CHF",
        "CAD",
        "AUD",
        "NZD",
        "SEK",
        "NOK",
        "SGD",
    ]

    pairs = []
    for i in range(len(nodes) - 1):
        pairs.extend([(nodes[i], nodes[i + 1]), (nodes[i + 1], nodes[i])])

    info = ScenarioInfo(
        name="linear_chain",
        display_name="Linear Chain",
        description="Single-path topology for shortest-path tests.",
        nodes=nodes,
        pairs=pairs,
    )

    return values_for(nodes), info


def get_available_scenarios() -> List[ScenarioInfo]:
    scenarios = [
        scenario_negative_cycle,
        scenario_sparse_graph,
        scenario_dense_graph,
        scenario_hub_and_spoke,
        scenario_disconnected_components,
        scenario_balanced_tree,
        scenario_linear_chain,
    ]

    return [scenario()[1] for scenario in scenarios]


def get_scenario(scenario_id: str) -> Tuple[Dict[str, float], ScenarioInfo]:
    scenarios = {
        "negative_cycle": scenario_negative_cycle,
        "sparse_graph": scenario_sparse_graph,
        "dense_graph": scenario_dense_graph,
        "hub_and_spoke": scenario_hub_and_spoke,
        "disconnected_components": scenario_disconnected_components,
        "balanced_tree": scenario_balanced_tree,
        "linear_chain": scenario_linear_chain,
    }

    if scenario_id not in scenarios:
        available = ", ".join(scenarios.keys())
        raise ValueError(f"Unknown scenario: {scenario_id}. Available: {available}")

    return scenarios[scenario_id]()
