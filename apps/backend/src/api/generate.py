"""Dataset generation endpoint."""

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException

from ..config import config
from ..cache import graph_cache
from ..generation.generator import GraphDataGenerator
from ..generation.scenarios import DEFAULT_SCENARIO_ID, get_scenario
from ..graph.builder import GraphBuilder
from ..models import CostModel, GenerationRequest, GenerationResponse

logger = logging.getLogger(__name__)

router = APIRouter()


def generate_snapshot_id(
    timestamp: datetime,
    dataset_type: str,
    anchor_node: str,
    scenario_id: Optional[str] = None,
) -> str:
    time_str = timestamp.strftime("%Y-%m-%dT%H-%M-%SZ")
    source_str = scenario_id if scenario_id else dataset_type
    return f"{time_str}_{source_str}_{anchor_node}"


@router.post("/generate", response_model=GenerationResponse, status_code=201)
async def generate_snapshot(request: Optional[GenerationRequest] = None):
    if request is None:
        request = GenerationRequest(mode="scenario", scenario_id=DEFAULT_SCENARIO_ID)

    mode = request.mode
    anchor_node = request.anchor_node or config.anchor_node

    try:
        generator = GraphDataGenerator()

        if mode == "scenario":
            scenario_id = request.scenario_id or DEFAULT_SCENARIO_ID

            try:
                scenario_values, scenario_info = get_scenario(scenario_id)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))

            nodes = scenario_info.nodes
            if anchor_node not in nodes:
                raise HTTPException(
                    status_code=400,
                    detail="anchor_node must be part of the selected scenario",
                )

            pairs = scenario_info.pairs

            dataset = generator.generate_from_scenario(
                scenario_id=scenario_id,
                scenario_values=scenario_values,
                anchor_node=anchor_node,
                nodes=nodes,
            )

        elif mode == "custom":
            if not request.custom_values:
                raise HTTPException(
                    status_code=400,
                    detail="custom_values is required for custom mode",
                )

            nodes = request.nodes or config.nodes
            if not nodes:
                raise HTTPException(status_code=400, detail="Node list cannot be empty")

            if len(nodes) > 200:
                raise HTTPException(status_code=400, detail="Node list too large (max 200)")

            for node in nodes:
                if not node or not node.strip():
                    raise HTTPException(
                        status_code=400,
                        detail="Node ids must be non-empty strings",
                    )

            if anchor_node not in nodes:
                nodes = [anchor_node] + nodes

            dataset = generator.generate_custom_values(
                custom_values=request.custom_values,
                anchor_node=anchor_node,
                nodes=nodes,
            )

            pairs = request.pairs

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid mode: {mode}. Must be 'scenario' or 'custom'",
            )

        cost_model = CostModel(base_cost=config.base_cost, extra_cost=config.extra_cost)
        graph_builder = GraphBuilder(cost_model=cost_model)

        graph_payload = graph_builder.build_graph(
            node_values=dataset.node_values,
            nodes=nodes,
            pairs=pairs,
        )

        timestamp = datetime.now(timezone.utc)
        timestamp_str = timestamp.isoformat()
        snapshot_id = generate_snapshot_id(
            timestamp=timestamp,
            dataset_type=dataset.dataset_type,
            anchor_node=dataset.anchor_node,
            scenario_id=dataset.scenario_id,
        )
        graph_cache.set(snapshot_id, graph_payload, timestamp_str)

        return GenerationResponse(
            snapshot_id=snapshot_id,
            timestamp=timestamp_str,
            node_count=graph_payload.metadata.node_count,
            edge_count=graph_payload.metadata.edge_count,
            dataset_type=dataset.dataset_type,
            scenario_id=dataset.scenario_id,
            graph_payload=graph_payload,
        )

    except ValueError as e:
        logger.error("Validation error during generate: %s", e)
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error("Error during generate: %s", e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate snapshot: {str(e)}",
        )
