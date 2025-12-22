"""Graph dataset generator."""

from datetime import datetime, timezone
from typing import Dict, List

from ..models import GeneratedDataset


class GraphDataGenerator:
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
        node_values = dict(custom_values)
        if anchor_node not in node_values:
            node_values[anchor_node] = 1.0

        return GeneratedDataset(
            dataset_type="custom",
            node_values=node_values,
            timestamp=datetime.now(timezone.utc).isoformat(),
            nodes=nodes,
            anchor_node=anchor_node,
            generation_params={"custom": True},
        )
