"""Pydantic models for graph data and algorithm APIs."""

from typing import Any, Dict, List, Literal, Optional, Tuple

from pydantic import AliasChoices, BaseModel, Field, ConfigDict, field_validator


class CostModel(BaseModel):
    base_cost: float = Field(..., ge=0)
    extra_cost: float = Field(..., ge=0)

    @property
    def total_cost(self) -> float:
        return self.base_cost + self.extra_cost


class GraphNode(BaseModel):
    id: str

    @field_validator("id")
    @classmethod
    def validate_node_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Node id cannot be empty")
        return v


class GraphEdge(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    source: str = Field(
        ..., validation_alias=AliasChoices("source", "from"), serialization_alias="from"
    )
    target: str = Field(
        ..., validation_alias=AliasChoices("target", "to"), serialization_alias="to"
    )
    weight_cost: float
    weight_neglog: float


class GraphMetadata(BaseModel):
    node_count: int
    edge_count: int


class GraphPayload(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    metadata: GraphMetadata


class GeneratedDataset(BaseModel):
    dataset_type: Literal["scenario", "custom"] = Field(
        ..., validation_alias=AliasChoices("dataset_type", "source_type")
    )
    scenario_id: Optional[str] = Field(
        None, validation_alias=AliasChoices("scenario_id", "scenario_name")
    )
    generation_params: Dict[str, Any] = Field(default_factory=dict)
    node_values: Dict[str, float] = Field(
        ..., validation_alias=AliasChoices("node_values", "rates_base")
    )
    timestamp: str
    nodes: List[str] = Field(
        ..., validation_alias=AliasChoices("nodes", "currencies")
    )
    anchor_node: str = Field(
        ..., validation_alias=AliasChoices("anchor_node", "base_currency")
    )

    @field_validator("node_values")
    @classmethod
    def validate_values(cls, v: Dict[str, float]) -> Dict[str, float]:
        for node, value in v.items():
            if value <= 0:
                raise ValueError(f"Value for {node} must be positive, got {value}")
        return v


class GenerationRequest(BaseModel):
    mode: Literal["scenario", "custom"] = "scenario"
    scenario_id: Optional[str] = Field(
        None, validation_alias=AliasChoices("scenario_id", "scenario_name")
    )
    custom_values: Optional[Dict[str, float]] = Field(
        None, validation_alias=AliasChoices("custom_values", "custom_rates")
    )

    anchor_node: Optional[str] = Field(
        None, validation_alias=AliasChoices("anchor_node", "base_currency")
    )
    nodes: Optional[List[str]] = Field(
        None, validation_alias=AliasChoices("nodes", "currencies")
    )
    pairs: Optional[List[Tuple[str, str]]] = None


class GenerationResponse(BaseModel):
    snapshot_id: str
    timestamp: str
    node_count: int
    edge_count: int
    dataset_type: str
    scenario_id: Optional[str] = None
    graph_payload: GraphPayload


class HealthResponse(BaseModel):
    status: str
    latest_snapshot: Optional[str] = None
    snapshot_count: int = 0


class BFSRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None
    start_node: str = Field(
        ..., validation_alias=AliasChoices("start_node", "start_currency")
    )


class DFSRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None
    start_node: str = Field(
        ..., validation_alias=AliasChoices("start_node", "start_currency")
    )


class DijkstraRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None
    source: str
    target: Optional[str] = None


class BellmanFordRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None
    source: str
    detect_negative_cycle: bool = True


class FloydWarshallRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None
    weight_mode: Literal["cost", "neglog"]


class MSTRequest(BaseModel):
    snapshot_id: Optional[str] = Field(None, description="Snapshot ID (default: latest)")
    graph_payload: Optional[GraphPayload] = None


class BFSResponse(BaseModel):
    snapshot_id: str
    algorithm: str = "bfs"
    start_node: str
    order: List[str]
    parent: Dict[str, Optional[str]]
    depth: Dict[str, int]


class DFSResponse(BaseModel):
    snapshot_id: str
    algorithm: str = "dfs"
    start_node: str
    order: List[str]
    parent: Dict[str, Optional[str]]
    discovery_time: Dict[str, int]
    finish_time: Dict[str, int]


class PathDetail(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    source: str = Field(
        ..., validation_alias=AliasChoices("source", "from"), serialization_alias="from"
    )
    target: str = Field(
        ..., validation_alias=AliasChoices("target", "to"), serialization_alias="to"
    )
    weight: float


class DijkstraResponse(BaseModel):
    snapshot_id: str
    algorithm: str = "dijkstra"
    source: str
    target: Optional[str] = None
    found: bool
    distance: Optional[float] = None
    path: List[str] = Field(default_factory=list)
    path_details: List[PathDetail] = Field(default_factory=list)
    all_distances: Dict[str, Optional[float]] = Field(default_factory=dict)


class BellmanFordResponse(BaseModel):
    snapshot_id: str
    algorithm: str = "bellman_ford"
    source: str
    negative_cycle_found: bool
    cycle: Optional[List[str]] = None
    distances: Dict[str, Optional[float]] = Field(default_factory=dict)
    paths: Dict[str, List[str]] = Field(default_factory=dict)


class CentralityInfo(BaseModel):
    reachable_count: int
    sum_distance: Optional[float]


class FloydWarshallResponse(BaseModel):
    snapshot_id: str
    algorithm: str = "floyd_warshall"
    weight_mode: str
    node_order: List[str]
    distance_matrix: Dict[str, Dict[str, Optional[float]]]
    central_node: Optional[str] = None
    centrality: Dict[str, CentralityInfo]
    centrality_note: str


class MSTEdgeResponse(BaseModel):
    u: str
    v: str
    weight: float


class MSTResponse(BaseModel):
    snapshot_id: str
    algorithm: str
    edges: List[MSTEdgeResponse]
    total_cost: float
    is_forest: bool
    num_components: int
