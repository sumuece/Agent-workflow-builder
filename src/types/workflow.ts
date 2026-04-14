import type { Edge, Node } from '@xyflow/react';

/** All step types supported in the graph (professional agent orchestration). */
export type AgentNodeKind =
  | 'trigger'
  | 'agent'
  | 'memory'
  | 'tool'
  | 'mcp'
  | 'condition'
  | 'human'
  | 'parallel'
  | 'merge'
  | 'transform'
  | 'guardrail'
  | 'subflow'
  | 'output'
  | 'custom';

export type AgentNodeData = {
  label: string;
  kind: AgentNodeKind;
  description?: string;
  /** Kind-specific key/value configuration (URLs, model ids, etc.). */
  config?: Record<string, string>;
};

export type AgentNode = Node<AgentNodeData, AgentNodeKind>;
export type AgentEdge = Edge;

export type WorkflowDocument = {
  name: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
};

export const NODE_KIND_LABELS: Record<AgentNodeKind, string> = {
  trigger: 'Trigger',
  agent: 'Agent',
  memory: 'Memory',
  tool: 'Tool',
  mcp: 'MCP server',
  condition: 'Condition',
  human: 'Human review',
  parallel: 'Parallel',
  merge: 'Merge',
  transform: 'Transform',
  guardrail: 'Guardrail',
  subflow: 'Sub-workflow',
  output: 'Output',
  custom: 'Custom',
};
