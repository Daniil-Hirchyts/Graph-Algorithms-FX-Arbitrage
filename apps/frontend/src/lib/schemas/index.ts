import { z } from 'zod';

export const NodeId = z.string().trim().min(1);

export const GraphNodeSchema = z.object({
  id: z.string(),
});

export const GraphEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  weight_cost: z.number(),
  weight_neglog: z.number(),
});

export const GraphMetadataSchema = z.object({
  node_count: z.number(),
  edge_count: z.number(),
});

export const GraphPayloadSchema = z.object({
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
  metadata: GraphMetadataSchema,
});

export const GenerationParamsSchema = z.object({
  num_nodes: z.number().min(3).max(50).optional(),
  value_min: z.number().positive().optional(),
  value_max: z.number().positive().optional(),
  variance: z.enum(['low', 'medium', 'high']).optional(),
  seed: z.number().int().optional(),
});

export const GenerationRequestSchema = z.object({
  mode: z.enum(['random', 'scenario', 'custom']),
  scenario_id: z.string().optional(),
  custom_values: z.record(z.string(), z.number()).optional(),
  generation_params: GenerationParamsSchema.optional(),
  anchor_node: z.string().optional(),
  nodes: z.array(z.string()).optional(),
  pairs: z.array(z.tuple([z.string(), z.string()])).optional(),
});

export const ScenarioInfoSchema = z.object({
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  nodes: z.array(z.string()),
  pairs: z.array(z.tuple([z.string(), z.string()])),
});

export const HealthResponseSchema = z.object({
  status: z.string(),
  latest_snapshot: z.string().nullable(),
  snapshot_count: z.number(),
});

export const GenerationResponseSchema = z.object({
  snapshot_id: z.string(),
  timestamp: z.string(),
  node_count: z.number(),
  edge_count: z.number(),
  dataset_type: z.string(),
  scenario_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema,
});

export const BFSRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
  start_node: NodeId,
});

export const DFSRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
  start_node: NodeId,
});

export const DijkstraRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
  source: NodeId,
  target: NodeId.optional(),
});

export const BellmanFordRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
  source: NodeId,
  detect_negative_cycle: z.boolean().default(true),
});

export const FloydWarshallRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
  weight_mode: z.enum(['cost', 'neglog']),
});

export const MSTRequestSchema = z.object({
  snapshot_id: z.string().optional().nullable(),
  graph_payload: GraphPayloadSchema.optional(),
});

export const BFSResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  start_node: z.string(),
  order: z.array(z.string()),
  parent: z.record(z.string(), z.string().nullable()),
  depth: z.record(z.string(), z.number()),
});

export const DFSResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  start_node: z.string(),
  order: z.array(z.string()),
  parent: z.record(z.string(), z.string().nullable()),
  discovery_time: z.record(z.string(), z.number()),
  finish_time: z.record(z.string(), z.number()),
});

export const PathDetailSchema = z.object({
  from: z.string(),
  to: z.string(),
  weight: z.number(),
});

export const DijkstraResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  source: z.string(),
  target: z.string().nullable().optional(),
  found: z.boolean(),
  distance: z.number().nullable().optional(),
  path: z.array(z.string()).optional().default([]),
  path_details: z.array(PathDetailSchema).optional().default([]),
  all_distances: z.record(z.string(), z.number().nullable()).optional().default({}),
});

export const BellmanFordResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  source: z.string(),
  negative_cycle_found: z.boolean(),
  cycle: z.array(z.string()).nullable().optional(),
  distances: z.record(z.string(), z.number().nullable()).optional().default({}),
  paths: z.record(z.string(), z.array(z.string())).optional().default({}),
});

export const CentralityInfoSchema = z.object({
  reachable_count: z.number(),
  sum_distance: z.number().nullable(),
});

export const FloydWarshallResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  weight_mode: z.string(),
  node_order: z.array(z.string()),
  distance_matrix: z.record(z.string(), z.record(z.string(), z.number().nullable())),
  central_node: z.string().nullable(),
  centrality: z.record(z.string(), CentralityInfoSchema),
  centrality_note: z.string(),
});

export const MSTEdgeResponseSchema = z.object({
  u: z.string(),
  v: z.string(),
  weight: z.number(),
});

export const MSTResponseSchema = z.object({
  snapshot_id: z.string(),
  algorithm: z.string(),
  edges: z.array(MSTEdgeResponseSchema),
  total_cost: z.number(),
  is_forest: z.boolean(),
  num_components: z.number(),
});

export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphEdge = z.infer<typeof GraphEdgeSchema>;
export type GraphMetadata = z.infer<typeof GraphMetadataSchema>;
export type GraphPayload = z.infer<typeof GraphPayloadSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;
export type GenerationParams = z.infer<typeof GenerationParamsSchema>;
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type ScenarioInfo = z.infer<typeof ScenarioInfoSchema>;

export type BFSRequest = z.infer<typeof BFSRequestSchema>;
export type DFSRequest = z.infer<typeof DFSRequestSchema>;
export type DijkstraRequest = z.infer<typeof DijkstraRequestSchema>;
export type BellmanFordRequest = z.infer<typeof BellmanFordRequestSchema>;
export type FloydWarshallRequest = z.infer<typeof FloydWarshallRequestSchema>;
export type MSTRequest = z.infer<typeof MSTRequestSchema>;

export type BFSResponse = z.infer<typeof BFSResponseSchema>;
export type DFSResponse = z.infer<typeof DFSResponseSchema>;
export type DijkstraResponse = z.infer<typeof DijkstraResponseSchema>;
export type PathDetail = z.infer<typeof PathDetailSchema>;
export type BellmanFordResponse = z.infer<typeof BellmanFordResponseSchema>;
export type FloydWarshallResponse = z.infer<typeof FloydWarshallResponseSchema>;
export type CentralityInfo = z.infer<typeof CentralityInfoSchema>;
export type MSTResponse = z.infer<typeof MSTResponseSchema>;
export type MSTEdgeResponse = z.infer<typeof MSTEdgeResponseSchema>;
