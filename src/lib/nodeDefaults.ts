import type { AgentNodeKind } from '../types/workflow';
import { loadAppSettings } from './settingsStorage';

const BASE: Partial<Record<AgentNodeKind, Record<string, string>>> = {
  trigger: { channel: 'api' },
  agent: { model: '', temperature: '0.2', maxTokens: '4096' },
  memory: { store: 'default', topK: '8' },
  tool: { name: '', method: 'POST', endpoint: '' },
  mcp: { transport: 'sse', serverUrl: '', command: '', tools: '' },
  condition: { expression: '' },
  human: { assignee: '', timeout: '86400' },
  parallel: { branches: '2' },
  merge: { strategy: 'all' },
  transform: { language: 'jsonata', expression: '' },
  guardrail: { policyId: '', action: 'block' },
  subflow: { workflowId: '', version: 'latest' },
  output: { format: 'json' },
  custom: { customType: '', definition: '', parameters: '' },
};

export function getDefaultConfigForKind(kind: AgentNodeKind): Record<string, string> {
  const settings = loadAppSettings();
  const cfg = { ...(BASE[kind] ?? {}) };
  if (kind === 'agent' && settings.defaultModel) {
    cfg.model = settings.defaultModel;
  }
  return cfg;
}
