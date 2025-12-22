export interface AlgorithmExplanation {
  id: string;
  name: string;
  category: string;

  // Plain language explanation
  whatIsIt: string;

  // How it works
  howItWorks: string[];

  // Generic graph theory perspective
  graphTheory: {
    purpose: string;
    input: string;
    output: string;
    complexity: string;
  };

  // Applied context
  domainApplication: {
    purpose: string;
    whatItFinds: string;
    whyUseful: string;
  };

  // Step-by-step example
  example?: {
    scenario: string;
    steps: string[];
    result: string;
    graphData?: {
      nodes: { id: string; label?: string }[];
      edges: { source: string; target: string; label?: string; weight?: number }[];
    };
  };

  // Key concepts
  keyConcepts: string[];
}

export const algorithmExplanations: Record<string, AlgorithmExplanation> = {
  bfs: {
    id: "bfs",
    name: "Breadth-First Search (BFS)",
    category: "Graph Traversal",

    whatIsIt: "BFS explores a graph layer by layer, like ripples spreading in water. It visits all immediate neighbors before moving to the next level.",

    howItWorks: [
      "Start at a chosen node (the source)",
      "Add it to a queue and mark as visited",
      "Take the first node from the queue",
      "Visit all its unvisited neighbors and add them to the queue",
      "Repeat until the queue is empty"
    ],

    graphTheory: {
      purpose: "Systematically explore all nodes reachable from a starting node",
      input: "Graph and starting node",
      output: "Order of node visits, parent relationships, and distances (in unweighted graphs)",
      complexity: "O(V + E) where V = nodes, E = edges"
    },

    domainApplication: {
      purpose: "Find all currencies reachable from a starting currency",
      whatItFinds: "Which currencies you can convert to and how many steps it takes",
      whyUseful: "Understand reachability across the exchange network"
    },

    example: {
      scenario: "Starting from USD, we want to find all reachable currencies layer by layer to understand the market structure.",
      steps: [
        "Start at USD (Level 0). Queue: [USD]",
        "Process USD: Found neighbors EUR, GBP, CAD. Queue: [EUR, GBP, CAD]",
        "Process EUR (Level 1): Found neighbor JPY. Queue: [GBP, CAD, JPY]",
        "Process GBP (Level 1): Found neighbor CHF. Queue: [CAD, JPY, CHF]",
        "Process CAD (Level 1): Found neighbor AUD. Queue: [JPY, CHF, AUD]",
        "Process JPY (Level 2): Found neighbor NZD. Queue: [CHF, AUD, NZD]",
        "Process remaining nodes (CHF, AUD, NZD) which have no new unvisited neighbors.",
        "Result: We have mapped the market in layers of reachability."
      ],
      result: "Layer 0: USD; Layer 1: EUR, GBP, CAD; Layer 2: JPY, CHF, AUD; Layer 3: NZD.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' }, { id: 'CAD' },
          { id: 'JPY' }, { id: 'CHF' }, { id: 'AUD' }, { id: 'NZD' }
        ],
        edges: [
          { source: 'USD', target: 'EUR' },
          { source: 'USD', target: 'GBP' },
          { source: 'USD', target: 'CAD' },
          { source: 'EUR', target: 'JPY' },
          { source: 'GBP', target: 'CHF' },
          { source: 'CAD', target: 'AUD' },
          { source: 'JPY', target: 'NZD' },
          { source: 'CHF', target: 'JPY' } // Cross edge
        ]
      }
    },

    keyConcepts: [
      "Uses a queue (First-In-First-Out)",
      "Guarantees shortest path in unweighted graphs",
      "Explores closer nodes before distant ones",
      "Creates a spanning tree rooted at the start node"
    ]
  },

  dfs: {
    id: "dfs",
    name: "Depth-First Search (DFS)",
    category: "Graph Traversal",

    whatIsIt: "DFS explores a graph by going as deep as possible along each branch before backtracking. Like exploring a maze by following one path until you hit a dead end.",

    howItWorks: [
      "Start at a chosen node",
      "Mark it as visited",
      "For each unvisited neighbor, recursively visit it (go deep)",
      "Backtrack when you reach a node with no unvisited neighbors",
      "Continue until all reachable nodes are visited"
    ],

    graphTheory: {
      purpose: "Explore graph by following paths as far as possible before backtracking",
      input: "Graph and starting node",
      output: "Visit order, discovery/finish times, parent relationships",
      complexity: "O(V + E) where V = nodes, E = edges"
    },

    domainApplication: {
      purpose: "Explore currency exchange paths deeply",
      whatItFinds: "Long conversion chains and cyclic patterns",
      whyUseful: "Detect circular exchange opportunities and analyze deep conversion paths"
    },

    example: {
      scenario: "Starting from USD, we want to simulate a trader following a single chain of conversions as far as possible before trying alternatives.",
      steps: [
        "Start at USD. Choose neighbor EUR.",
        "From EUR, choose JPY. Path: USD -> EUR -> JPY",
        "From JPY, choose AUD. Path: USD -> EUR -> JPY -> AUD",
        "From AUD, choose NZD. Path: USD -> EUR -> JPY -> AUD -> NZD",
        "NZD is a dead end (no unvisited neighbors). Backtrack to AUD.",
        "AUD has no other unvisited neighbors. Backtrack to JPY.",
        "Backtrack to EUR. EUR has another neighbor CHF.",
        "Go deep: EUR -> CHF. CHF has neighbor GBP.",
        "Go deep: CHF -> GBP. GBP connects back to USD (visited).",
        "Backtrack to complete exploration."
      ],
      result: "Traversal Order: USD, EUR, JPY, AUD, NZD, CHF, GBP. Note the deep path first.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'JPY' }, { id: 'AUD' },
          { id: 'NZD' }, { id: 'CHF' }, { id: 'GBP' }
        ],
        edges: [
          { source: 'USD', target: 'EUR' },
          { source: 'USD', target: 'GBP' }, // Alternative path not taken first
          { source: 'EUR', target: 'JPY' },
          { source: 'EUR', target: 'CHF' },
          { source: 'JPY', target: 'AUD' },
          { source: 'AUD', target: 'NZD' },
          { source: 'CHF', target: 'GBP' }
        ]
      }
    },

    keyConcepts: [
      "Uses a stack (or recursion)",
      "Explores one branch completely before trying another",
      "Can detect cycles efficiently",
      "Creates a spanning forest (tree for each component)"
    ]
  },

  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Shortest Path",

    whatIsIt: "Dijkstra finds the shortest path from one node to all others in a graph with non-negative edge weights. Like finding the fastest route on a map.",

    howItWorks: [
      "Initialize: Set source distance to 0, all others to infinity",
      "Use a priority queue to always process the nearest unvisited node",
      "For each neighbor, check if going through current node is shorter",
      "If yes, update the shorter distance (relaxation)",
      "Mark node as visited and repeat",
      "Continue until all nodes processed or target reached"
    ],

    graphTheory: {
      purpose: "Find shortest paths from source to all nodes (single-source shortest path)",
      input: "Weighted graph (non-negative weights) and source node",
      output: "Shortest distances and paths from source to all reachable nodes",
      complexity: "O((V + E) log V) with binary heap, O(V²) with array"
    },

    domainApplication: {
      purpose: "Find the cheapest way to convert from one currency to another",
      whatItFinds: "The conversion route with minimum total cost",
      whyUseful: "Minimize transaction costs when converting currencies"
    },

    example: {
      scenario: "Find the most cost-efficient route to convert USD to JPY, avoiding expensive direct fees.",
      steps: [
        "Start at USD (Cost 0). Neighbors: EUR (2), GBP (5).",
        "Pick cheapest: EUR (Cost 2). Update neighbors of EUR.",
        "From EUR: check JPY (Cost 2+4=6) and CHF (Cost 2+1=3).",
        "Current shortest known: USD->EUR->CHF (3), USD->GBP (5), USD->EUR->JPY (6).",
        "Pick cheapest unvisited: CHF (Cost 3). Update neighbors of CHF.",
        "From CHF: check JPY (Cost 3+1=4). This is better than previous 6!",
        "Update JPY cost to 4 (Path: USD->EUR->CHF->JPY).",
        "Next cheapest: GBP (Cost 5). Check neighbors (none improve JPY).",
        "Finally visit JPY (Cost 4). Target reached."
      ],
      result: "Optimal Path: USD -> EUR -> CHF -> JPY. Total Cost: 4 (vs Direct/Other paths).",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' }, { id: 'CHF' }, { id: 'JPY' }
        ],
        edges: [
          { source: 'USD', target: 'EUR', weight: 2 },
          { source: 'USD', target: 'GBP', weight: 5 },
          { source: 'EUR', target: 'JPY', weight: 4 }, // Expensive direct link
          { source: 'EUR', target: 'CHF', weight: 1 }, // Cheaper detour
          { source: 'CHF', target: 'JPY', weight: 1 }, // Cheaper detour
          { source: 'GBP', target: 'JPY', weight: 2 }
        ]
      }
    },

    keyConcepts: [
      "Greedy algorithm: always picks nearest unprocessed node",
      "Only works with non-negative weights",
      "Guarantees optimal solution",
      "Uses priority queue for efficiency"
    ]
  },

  bellmanFord: {
    id: "bellmanFord",
    name: "Bellman-Ford Algorithm",
    category: "Shortest Path",

    whatIsIt: "Bellman-Ford finds shortest paths even when edges can have negative weights. It can also detect negative cycles.",

    howItWorks: [
      "Initialize: Source distance = 0, all others = infinity",
      "Repeat V-1 times: Relax ALL edges (check if shorter path exists)",
      "After V-1 iterations, shortest paths are found",
      "Do one more iteration: If any distance improves, negative cycle exists",
      "If negative cycle found, trace it back to identify the cycle"
    ],

    graphTheory: {
      purpose: "Find shortest paths with negative weights and detect negative cycles",
      input: "Weighted graph (can have negative weights) and source node",
      output: "Shortest distances, paths, and negative cycle detection",
      complexity: "O(V × E) where V = nodes, E = edges"
    },

    domainApplication: {
      purpose: "Detect arbitrage opportunities in FX markets",
      whatItFinds: "Whether a profitable conversion loop exists",
      whyUseful: "Flags cycles where total cost keeps decreasing"
    },

    example: {
      scenario: "Identify a hidden arbitrage loop where trading through multiple currencies results in a profit (negative total weight).",
      steps: [
        "Iteration 1: Relax edges. USD->EUR(1), EUR->GBP(1). Distances: EUR=1, GBP=Inf.",
        "Iteration 2: Relax edges. GBP is now reachable via EUR. Distances: EUR=1, GBP=2.",
        "Iteration 3: Check GBP->CAD(-5). CAD Distance = 2 - 5 = -3.",
        "Iteration 4: Check CAD->USD(1). USD Distance = -3 + 1 = -2. Improved from 0!",
        "Iteration 5 (Detection): We can still improve USD distance by going through the loop again.",
        "Conclusion: Negative cycle detected USD -> EUR -> GBP -> CAD -> USD."
      ],
      result: "Arbitrage Opportunity: The cycle USD-EUR-GBP-CAD-USD has a net weight of -2.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' }, { id: 'CAD' }, { id: 'JPY' }
        ],
        edges: [
          { source: 'USD', target: 'EUR', weight: 1 },
          { source: 'EUR', target: 'GBP', weight: 1 },
          { source: 'GBP', target: 'CAD', weight: -5 }, // The 'profit' leg
          { source: 'CAD', target: 'USD', weight: 1 },
          { source: 'USD', target: 'JPY', weight: 2 }, // Distraction path
          { source: 'JPY', target: 'CAD', weight: 2 }
        ]
      }
    },

    keyConcepts: [
      "Slower than Dijkstra but handles negative weights",
      "Relaxes edges repeatedly (V-1 times)",
      "Can detect negative cycles",
      "Useful for graphs with negative edges"
    ]
  },

  floydWarshall: {
    id: "floydWarshall",
    name: "Floyd-Warshall Algorithm",
    category: "All-Pairs Shortest Path",

    whatIsIt: "Floyd-Warshall finds shortest paths between ALL pairs of nodes. Like computing a distance table for every city to every other city.",

    howItWorks: [
      "Start with a distance matrix: direct edge weights",
      "For each intermediate node k:",
      "  For each pair (i, j):",
      "    Check if path i→k→j is shorter than current i→j",
      "    If yes, update the distance",
      "After trying all intermediate nodes, you have all shortest paths"
    ],

    graphTheory: {
      purpose: "Compute shortest paths between every pair of nodes",
      input: "Weighted graph (can have negative weights)",
      output: "Distance matrix with shortest distances for all pairs",
      complexity: "O(V³) where V = number of nodes"
    },

    domainApplication: {
      purpose: "Build a complete conversion cost table for all currency pairs",
      whatItFinds: "The cheapest conversion cost between any two currencies",
      whyUseful: "Precompute optimal routes for any conversion query"
    },

    example: {
      scenario: "Build a comprehensive lookup table for the cheapest rates between ANY two currencies in a 5-node network.",
      steps: [
        "Init: Matrix with direct costs. Inf where no direct edge.",
        "Phase 1 (via USD): Update paths like CAD->USD->EUR.",
        "Phase 2 (via EUR): Update paths like USD->EUR->GBP. Might improve USD->GBP.",
        "Phase 3 (via GBP): Update paths like EUR->GBP->JPY.",
        "Phase 4 (via JPY): Update paths passing through JPY.",
        "Phase 5 (via CAD): Final updates.",
        "Result: A filled matrix where cell [i][j] is the absolute minimum cost."
      ],
      result: "We discovered that CAD->JPY is cheaper via USD->EUR than directly.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' }, { id: 'JPY' }, { id: 'CAD' }
        ],
        edges: [
          { source: 'USD', target: 'EUR', weight: 1 },
          { source: 'EUR', target: 'GBP', weight: 1 },
          { source: 'GBP', target: 'JPY', weight: 1 },
          { source: 'JPY', target: 'USD', weight: 10 }, // Expensive
          { source: 'CAD', target: 'USD', weight: 1 },
          { source: 'CAD', target: 'JPY', weight: 8 }, // Direct but expensive
          { source: 'EUR', target: 'JPY', weight: 5 }
        ]
      }
    },

    keyConcepts: [
      "Dynamic programming algorithm",
      "Considers all possible intermediate nodes",
      "Can detect negative cycles (diagonal becomes negative)",
      "Used to find the most 'central' node (lowest average distance)"
    ]
  },

  mstPrim: {
    id: "mstPrim",
    name: "Prim's Algorithm",
    category: "Minimum Spanning Tree",

    whatIsIt: "Prim builds a minimum spanning tree by growing it one edge at a time, always choosing the cheapest edge that connects to the tree.",

    howItWorks: [
      "Start with any node as the tree",
      "Find the cheapest edge connecting the tree to a new node",
      "Add that edge and node to the tree",
      "Repeat until all nodes are in the tree",
      "Result: A tree spanning all nodes with minimum total weight"
    ],

    graphTheory: {
      purpose: "Find minimum spanning tree connecting all nodes",
      input: "Connected, weighted, undirected graph",
      output: "Tree with V-1 edges connecting all V nodes with minimum total weight",
      complexity: "O(E log V) with binary heap"
    },

    domainApplication: {
      purpose: "Build the most efficient exchange network",
      whatItFinds: "Minimum set of exchange routes to connect all currencies",
      whyUseful: "Design a network with lowest operational cost"
    },

    example: {
      scenario: "Design a backbone network connecting 6 major currencies with the absolute minimum total link cost.",
      steps: [
        "Start with USD. Available edges: EUR(2), GBP(3), CAD(1).",
        "Pick cheapest: USD-CAD (1). Tree is {USD, CAD}.",
        "Available from tree: EUR(2), GBP(3), AUD(4 via CAD).",
        "Pick cheapest: USD-EUR (2). Tree is {USD, CAD, EUR}.",
        "Available from tree: GBP(3), AUD(4), JPY(2 via EUR).",
        "Pick cheapest: EUR-JPY (2). Tree is {USD, CAD, EUR, JPY}.",
        "Available: GBP(3), AUD(4), JPY-GBP(1).",
        "Pick cheapest: JPY-GBP (1). Tree is {..., JPY, GBP}.",
        "Finally pick GBP-AUD (3) over CAD-AUD (4). Tree Complete."
      ],
      result: "MST edges: USD-CAD, USD-EUR, EUR-JPY, JPY-GBP, GBP-AUD. Total Cost: 9.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' },
          { id: 'CAD' }, { id: 'JPY' }, { id: 'AUD' }
        ],
        edges: [
          { source: 'USD', target: 'EUR', weight: 2 },
          { source: 'USD', target: 'GBP', weight: 3 },
          { source: 'USD', target: 'CAD', weight: 1 },
          { source: 'CAD', target: 'AUD', weight: 4 },
          { source: 'EUR', target: 'JPY', weight: 2 },
          { source: 'GBP', target: 'JPY', weight: 1 },
          { source: 'GBP', target: 'AUD', weight: 3 },
          { source: 'EUR', target: 'GBP', weight: 5 } // Expensive redundant link
        ]
      }
    },

    keyConcepts: [
      "Greedy algorithm: always picks cheapest edge",
      "Grows a single tree from one node",
      "Uses priority queue for efficiency",
      "Good for dense graphs"
    ]
  },

  mstKruskal: {
    id: "mstKruskal",
    name: "Kruskal's Algorithm",
    category: "Minimum Spanning Tree",

    whatIsIt: "Kruskal builds a minimum spanning tree by sorting all edges and adding them one by one, avoiding cycles.",

    howItWorks: [
      "Sort all edges by weight (cheapest first)",
      "Start with empty forest (each node is a separate tree)",
      "For each edge in sorted order:",
      "  If it connects two different trees, add it",
      "  If it would create a cycle, skip it",
      "Continue until V-1 edges are added (connected)",
      "Use Union-Find data structure to track components"
    ],

    graphTheory: {
      purpose: "Find minimum spanning tree by considering edges globally",
      input: "Connected, weighted, undirected graph",
      output: "Tree with V-1 edges connecting all V nodes with minimum total weight",
      complexity: "O(E log E) due to sorting"
    },

    domainApplication: {
      purpose: "Build efficient exchange network by selecting cheapest routes",
      whatItFinds: "Minimum set of routes that connects all currencies",
      whyUseful: "Alternative approach, better for sparse graphs"
    },

    example: {
      scenario: "Connect 6 currencies with minimum cost using a global edge-sorting approach.",
      steps: [
        "Sort edges: USD-CAD(1), JPY-GBP(1), USD-EUR(2), EUR-JPY(2), GBP-AUD(3), USD-GBP(3)...",
        "Add USD-CAD (1). Sets: {USD,CAD}, {EUR}, {GBP}, ...",
        "Add JPY-GBP (1). Sets: {USD,CAD}, {JPY,GBP}, {EUR}, ...",
        "Add USD-EUR (2). Sets: {USD,CAD,EUR}, {JPY,GBP}, ...",
        "Add EUR-JPY (2). Connects the two main sets! Merged: {USD,CAD,EUR,JPY,GBP}.",
        "Next cheapest: GBP-AUD (3). Add it. All nodes connected.",
        "Remaining edges (USD-GBP, etc.) are skipped as they form cycles."
      ],
      result: "Same MST as Prim's: USD-CAD, JPY-GBP, USD-EUR, EUR-JPY, GBP-AUD.",
      graphData: {
        nodes: [
          { id: 'USD' }, { id: 'EUR' }, { id: 'GBP' },
          { id: 'CAD' }, { id: 'JPY' }, { id: 'AUD' }
        ],
        edges: [
          { source: 'USD', target: 'EUR', weight: 2 },
          { source: 'USD', target: 'GBP', weight: 3 },
          { source: 'USD', target: 'CAD', weight: 1 },
          { source: 'CAD', target: 'AUD', weight: 4 },
          { source: 'EUR', target: 'JPY', weight: 2 },
          { source: 'GBP', target: 'JPY', weight: 1 },
          { source: 'GBP', target: 'AUD', weight: 3 },
          { source: 'EUR', target: 'GBP', weight: 5 }
        ]
      }
    },

    keyConcepts: [
      "Edge-based approach (vs Prim's node-based)",
      "Requires sorting all edges",
      "Uses Union-Find for cycle detection",
      "Good for sparse graphs"
    ]
  }
};

/**
 * Get explanation for an algorithm by ID
 */
export function getAlgorithmExplanation(algorithmId: string): AlgorithmExplanation | null {
  return algorithmExplanations[algorithmId] || null;
}

/**
 * Get all algorithms by category
 */
export function getAlgorithmsByCategory(): Record<string, AlgorithmExplanation[]> {
  const categories: Record<string, AlgorithmExplanation[]> = {};

  Object.values(algorithmExplanations).forEach(algo => {
    if (!categories[algo.category]) {
      categories[algo.category] = [];
    }
    categories[algo.category].push(algo);
  });

  return categories;
}

/**
 * Concept explanations mapping graph theory to applied context
 */
export const conceptMappings = {
  node: {
    graph: "Vertex - A point in the graph representing an entity",
    domain: "Currency - A tradeable currency (USD, EUR, etc.)"
  },
  edge: {
    graph: "Edge - A connection between two vertices with a weight",
    domain: "Exchange Rate - The rate to convert one currency to another"
  },
  weight: {
    graph: "Weight - A numeric value associated with an edge",
    domain: "Cost - Transaction fees and spreads in basis points"
  },
  path: {
    graph: "Path - A sequence of connected vertices",
    domain: "Conversion Route - Series of exchanges to get from one currency to another"
  },
  cycle: {
    graph: "Cycle - A path that starts and ends at the same vertex",
    domain: "Round-trip - Converting through multiple currencies back to the original"
  },
  negativeCycle: {
    graph: "Negative Cycle - A cycle where total weight is negative",
    domain: "Arbitrage - A profit opportunity from circular currency conversion"
  },
  shortestPath: {
    graph: "Shortest Path - Path with minimum total weight",
    domain: "Cheapest Route - Conversion path with lowest total cost"
  },
  spanningTree: {
    graph: "Spanning Tree - Tree connecting all vertices with minimum edges",
    domain: "Exchange Network - Minimum routes needed to connect all currencies"
  }
};