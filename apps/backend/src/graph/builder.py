"""Graph builder."""

from typing import Dict, List, Tuple

from ..models import CostModel, GraphEdge, GraphMetadata, GraphNode, GraphPayload
from .weights import WeightCalculator


class GraphBuilder:
    def __init__(self, cost_model: CostModel):
        self.cost_model = cost_model
        self.weight_calculator = WeightCalculator()

    def build_graph(
        self,
        node_values: Dict[str, float],
        nodes: List[str],
        pairs: List[Tuple[str, str]] | None = None,
    ) -> GraphPayload:
        missing = set(nodes) - set(node_values.keys())
        if missing:
            raise ValueError(f"Missing values for nodes: {', '.join(missing)}")

        graph_nodes = [GraphNode(id=node) for node in sorted(nodes)]

        if not pairs:
            pairs = self._build_full_pairs(nodes)

        edges = self._build_pairs_edges(node_values, pairs)

        metadata = GraphMetadata(node_count=len(graph_nodes), edge_count=len(edges))

        return GraphPayload(nodes=graph_nodes, edges=edges, metadata=metadata)

    def _build_pairs_edges(
        self,
        node_values: Dict[str, float],
        pairs: List[Tuple[str, str]],
    ) -> List[GraphEdge]:
        edges = []
        available_nodes = set(node_values.keys())
        skipped_pairs = []

        for source, target in pairs:
            if source not in available_nodes or target not in available_nodes:
                skipped_pairs.append((source, target))
                continue

            if source == target:
                continue

            edge = self._create_edge(source, target, node_values)
            edges.append(edge)

        if skipped_pairs and not edges:
            raise ValueError(
                "No valid node pairs found. "
                f"Available nodes: {', '.join(sorted(available_nodes))}."
            )

        return edges

    @staticmethod
    def _build_full_pairs(nodes: List[str]) -> List[Tuple[str, str]]:
        pairs: List[Tuple[str, str]] = []
        for source in nodes:
            for target in nodes:
                if source == target:
                    continue
                pairs.append((source, target))
        return pairs

    def _create_edge(
        self,
        source: str,
        target: str,
        node_values: Dict[str, float],
    ) -> GraphEdge:
        raw_value = node_values[target] / node_values[source]
        value_factor = min(2.0, max(0.5, raw_value))

        base_cost = self.cost_model.base_cost * (0.7 + 0.6 * value_factor)
        extra_cost = self.cost_model.extra_cost * (0.8 + 0.4 / value_factor)

        _, _, weight_cost, weight_neglog = self.weight_calculator.calculate_all_weights(
            raw_value=raw_value,
            base_cost=base_cost,
            extra_cost=extra_cost,
        )

        return GraphEdge(
            source=source,
            target=target,
            weight_cost=weight_cost,
            weight_neglog=weight_neglog,
        )
