import type { AgentEdge, AgentNode } from '../types/workflow';

export const initialNodes: AgentNode[] = [
  {
    id: 'n1',
    type: 'trigger',
    position: { x: 40, y: 200 },
    data: {
      kind: 'trigger',
      label: 'API / chat trigger',
      description: 'Inbound request starts the run',
      config: { channel: 'api' },
    },
  },
  {
    id: 'n2',
    type: 'memory',
    position: { x: 280, y: 80 },
    data: {
      kind: 'memory',
      label: 'Load context',
      description: 'Retrieve session + RAG chunks',
      config: { store: 'default', topK: '8' },
    },
  },
  {
    id: 'n3',
    type: 'agent',
    position: { x: 280, y: 260 },
    data: {
      kind: 'agent',
      label: 'Orchestrator',
      description: 'Plan steps and pick tools / MCP',
      config: { model: 'gpt-4.1', temperature: '0.2', maxTokens: '4096' },
    },
  },
  {
    id: 'n4',
    type: 'mcp',
    position: { x: 560, y: 40 },
    data: {
      kind: 'mcp',
      label: 'Docs MCP',
      description: 'Hosted MCP for internal docs',
      config: { transport: 'sse', serverUrl: 'https://mcp.example.com/sse', tools: '' },
    },
  },
  {
    id: 'n5',
    type: 'tool',
    position: { x: 560, y: 180 },
    data: {
      kind: 'tool',
      label: 'Billing API',
      description: 'REST tool with auth from vault',
      config: { name: 'createInvoice', method: 'POST' },
    },
  },
  {
    id: 'n6',
    type: 'guardrail',
    position: { x: 560, y: 320 },
    data: {
      kind: 'guardrail',
      label: 'PII & tone',
      description: 'Block leaks; enforce brand voice',
      config: { policyId: 'corp-default', action: 'block' },
    },
  },
  {
    id: 'n7',
    type: 'condition',
    position: { x: 820, y: 200 },
    data: {
      kind: 'condition',
      label: 'Needs approval?',
      description: 'Route high-risk to human',
      config: { expression: 'riskScore > 0.7' },
    },
  },
  {
    id: 'n8',
    type: 'human',
    position: { x: 1080, y: 80 },
    data: {
      kind: 'human',
      label: 'Manager sign-off',
      description: 'Slack approval with SLA',
      config: { timeout: '86400', assignee: 'on-call' },
    },
  },
  {
    id: 'n9',
    type: 'transform',
    position: { x: 1080, y: 280 },
    data: {
      kind: 'transform',
      label: 'Shape response',
      description: 'JSON schema for client',
      config: { language: 'jsonata', expression: '' },
    },
  },
  {
    id: 'n10',
    type: 'output',
    position: { x: 1340, y: 200 },
    data: {
      kind: 'output',
      label: 'Stream to client',
      description: 'SSE / WebSocket reply',
      config: { format: 'json' },
    },
  },
];

export const initialEdges: AgentEdge[] = [
  { id: 'e1', source: 'n1', target: 'n2', animated: true },
  { id: 'e2', source: 'n1', target: 'n3', animated: true },
  { id: 'e3', source: 'n2', target: 'n3' },
  { id: 'e4', source: 'n3', target: 'n4' },
  { id: 'e5', source: 'n3', target: 'n5' },
  { id: 'e6', source: 'n3', target: 'n6' },
  { id: 'e7', source: 'n4', target: 'n7' },
  { id: 'e8', source: 'n5', target: 'n7' },
  { id: 'e9', source: 'n6', target: 'n7' },
  { id: 'e10', source: 'n7', target: 'n8' },
  { id: 'e11', source: 'n7', target: 'n9' },
  { id: 'e12', source: 'n8', target: 'n10' },
  { id: 'e13', source: 'n9', target: 'n10' },
];
