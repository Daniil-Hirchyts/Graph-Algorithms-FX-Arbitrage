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
      scenario: "Starting from USD, find all reachable currencies",
      steps: [
        "Start: USD (distance 0)",
        "Level 1: Visit EUR, GBP (distance 1 from USD)",
        "Level 2: Visit JPY, CHF (distance 2 from USD)",
        "Continue until all connected nodes are found"
      ],
      result: "You get a tree showing the breadth-first exploration order"
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
      scenario: "Starting from USD, explore deeply",
      steps: [
        "Start: USD",
        "Go deep: USD → EUR → GBP → JPY",
        "Backtrack: JPY has no unvisited neighbors",
        "Try another path: USD → CHF → ...",
        "Continue until all paths are explored"
      ],
      result: "You get a depth-first spanning tree showing the exploration order"
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
      scenario: "Find cheapest way to convert USD to JPY",
      steps: [
        "Start: USD (cost 0)",
        "Check: USD→EUR (cost 2), USD→GBP (cost 5)",
        "Pick EUR (cheaper), now check EUR→JPY (cost 4)",
        "Compare: USD→GBP→JPY vs USD→EUR→JPY",
        "Choose the path with minimum total cost"
      ],
      result: "You get the optimal path: USD → EUR → JPY (total cost: 4)"
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
      scenario: "Detect arbitrage starting from USD",
      steps: [
        "Convert USD → EUR → GBP → USD",
        "Total cycle weight is negative (profitable loop)",
        "After V-1 relaxations, distances keep improving",
        "Algorithm detects the negative cycle",
        "Returns the cycle currencies"
      ],
      result: "Negative cycle found: USD → EUR → GBP → USD"
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
      scenario: "Build conversion table for USD, EUR, GBP, JPY",
      steps: [
        "Initialize matrix with direct edge weights",
        "Consider USD as intermediate: update any i→USD→j paths",
        "Consider EUR as intermediate: update paths through EUR",
        "Continue for all nodes",
        "Result: Complete matrix of best path costs"
      ],
      result: "You get a 4×4 matrix showing optimal cost between any currency pair"
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
      scenario: "Connect USD, EUR, GBP, JPY with minimum cost",
      steps: [
        "Start: Add USD to tree",
        "Cheapest edge from USD: USD-EUR (cost 2)",
        "Cheapest edge touching tree: EUR-GBP (cost 3)",
        "Cheapest edge touching tree: GBP-JPY (cost 1)",
        "All nodes connected, stop"
      ],
      result: "MST edges: USD-EUR, EUR-GBP, GBP-JPY (total cost: 6)"
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
      scenario: "Same problem as Prim, different approach",
      steps: [
        "Sort edges: GBP-JPY(1), USD-EUR(2), EUR-GBP(3), USD-GBP(4), ...",
        "Add GBP-JPY (connects GBP tree to JPY tree)",
        "Add USD-EUR (connects USD tree to EUR tree)",
        "Add EUR-GBP (connects USD-EUR tree to GBP-JPY tree)",
        "All connected, stop"
      ],
      result: "MST edges connect all currencies with minimal total cost"
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
