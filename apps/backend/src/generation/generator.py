"""Graph dataset generator."""

import random
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from ..models import GeneratedDataset


class GraphDataGenerator:
    def __init__(self, seed: Optional[int] = None):
        self.seed = seed
        if seed is not None:
            random.seed(seed)

    def generate_random_values(
        self,
        anchor_node: str,
        nodes: List[str],
        value_min: float = 0.1,
        value_max: float = 10.0,
        variance: str = "medium",
    ) -> GeneratedDataset:
        node_values: Dict[str, float] = {anchor_node: 1.0}

        for i, node in enumerate(nodes):
            if node == anchor_node:
                continue

            if variance == "low":
                value = random.uniform(0.8, 1.3)
            elif variance == "high":
                value = random.uniform(value_min, value_max)
                if random.random() > 0.5:
                    value *= random.uniform(1.5, 3.0)
                else:
                    value *= random.uniform(0.3, 0.7)
            else:
                value = random.uniform(value_min, value_max)
                if i % 3 == 0:
                    value *= random.uniform(0.5, 2.5)

            value = max(value_min, min(value_max * 2, value))
            node_values[node] = round(value, 6)

        return GeneratedDataset(
            dataset_type="random",
            node_values=node_values,
            timestamp=datetime.now(timezone.utc).isoformat(),
            nodes=nodes,
            anchor_node=anchor_node,
            generation_params={
                "value_min": value_min,
                "value_max": value_max,
                "variance": variance,
                "seed": self.seed,
                "num_nodes": len(nodes),
            },
        )

    def generate_random_pairs(
        self,
        nodes: List[str],
        density: float = 0.35,
    ) -> List[Tuple[str, str]]:
        if len(nodes) < 2:
            return []

        all_pairs = [(src, dst) for src in nodes for dst in nodes if src != dst]
        target_count = max(len(nodes), int(len(all_pairs) * density))

        pairs_set: set[Tuple[str, str]] = set()

        # Ensure at least one outgoing edge per node
        for src in nodes:
            dst = random.choice([n for n in nodes if n != src])
            pairs_set.add((src, dst))

        # Ensure at least one incoming edge per node
        incoming = {node: 0 for node in nodes}
        for src, dst in pairs_set:
            incoming[dst] += 1
        for dst, count in incoming.items():
            if count == 0:
                src = random.choice([n for n in nodes if n != dst])
                pairs_set.add((src, dst))

        if len(pairs_set) < target_count:
            remaining = list(set(all_pairs) - pairs_set)
            random.shuffle(remaining)
            pairs_set.update(remaining[: max(0, target_count - len(pairs_set))])

        return list(pairs_set)

    def generate_from_scenario(
        self,
        scenario_id: str,
        scenario_values: Dict[str, float],
        anchor_node: str,
        nodes: List[str],
    ) -> GeneratedDataset:
        return GeneratedDataset(
            dataset_type="scenario",
            scenario_id=scenario_id,
            node_values=scenario_values,
            timestamp=datetime.now(timezone.utc).isoformat(),
            nodes=nodes,
            anchor_node=anchor_node,
            generation_params={"scenario": scenario_id},
        )

    def generate_custom_values(
        self,
        custom_values: Dict[str, float],
        anchor_node: str,
        nodes: List[str],
    ) -> GeneratedDataset:
        if anchor_node not in custom_values:
            custom_values[anchor_node] = 1.0

        return GeneratedDataset(
            dataset_type="custom",
            node_values=custom_values,
            timestamp=datetime.now(timezone.utc).isoformat(),
            nodes=nodes,
            anchor_node=anchor_node,
            generation_params={"custom": True},
        )
