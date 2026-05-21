interface Edge {
  source: string
  target: string
}

interface Node {
  id: string
  [key: string]: unknown
}

/**
 * Check if adding an edge would create a cycle in the DAG.
 * Runs a DFS from `target` to see if we can reach `source`.
 */
export function wouldCreateCycle(
  edges: Edge[],
  source: string,
  target: string,
): boolean {
  // Build adjacency list from existing edges
  const adjacency = new Map<string, string[]>()
  for (const e of edges) {
    if (!adjacency.has(e.source)) adjacency.set(e.source, [])
    adjacency.get(e.source)!.push(e.target)
  }

  // Temporarily add the candidate edge
  if (!adjacency.has(source)) adjacency.set(source, [])
  adjacency.get(source)!.push(target)

  // DFS from target — if we reach source, there's a cycle
  const visited = new Set<string>()
  function dfs(node: string): boolean {
    if (node === source) return true
    if (visited.has(node)) return false
    visited.add(node)
    const neighbors = adjacency.get(node) || []
    return neighbors.some(n => dfs(n))
  }

  return dfs(target)
}

/**
 * Validate the entire DAG: returns { valid: true } or { valid: false, message }
 */
export function validateDAG(
  nodes: Node[],
  edges: Edge[],
): { valid: boolean; message?: string } {
  if (nodes.length === 0) {
    return { valid: false, message: '画布上至少需要一个 Agent 节点' }
  }

  // Build in-degree map
  const inDegree = new Map<string, number>()
  const adjacency = new Map<string, string[]>()

  for (const n of nodes) {
    inDegree.set(n.id, 0)
    adjacency.set(n.id, [])
  }

  for (const e of edges) {
    if (!inDegree.has(e.source) || !inDegree.has(e.target)) {
      return { valid: false, message: `连线引用了不存在的节点: ${e.source} → ${e.target}` }
    }
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1)
    adjacency.get(e.source)!.push(e.target)
  }

  // Kahn's algorithm for topological sort (cycle detection)
  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  let visitedCount = 0
  while (queue.length > 0) {
    const current = queue.shift()!
    visitedCount++
    for (const neighbor of adjacency.get(current) || []) {
      const newDeg = (inDegree.get(neighbor) || 1) - 1
      inDegree.set(neighbor, newDeg)
      if (newDeg === 0) queue.push(neighbor)
    }
  }

  if (visitedCount !== nodes.length) {
    return { valid: false, message: 'DAG 中存在循环依赖，请检查连线' }
  }

  return { valid: true }
}
