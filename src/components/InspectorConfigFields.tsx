import type { AgentNodeKind } from '../types/workflow';

type Props = {
  kind: AgentNodeKind;
  config: Record<string, string> | undefined;
  onConfigChange: (key: string, value: string) => void;
};

type FieldDef = { key: string; label: string; placeholder?: string; rows?: number };

const SCHEMA: Partial<Record<AgentNodeKind, FieldDef[]>> = {
  trigger: [
    { key: 'channel', label: 'Channel', placeholder: 'api | chat | schedule' },
  ],
  agent: [
    { key: 'model', label: 'Model', placeholder: 'e.g. gpt-4.1' },
    { key: 'temperature', label: 'Temperature', placeholder: '0–2' },
    { key: 'maxTokens', label: 'Max tokens', placeholder: '4096' },
  ],
  memory: [
    { key: 'store', label: 'Store / index', placeholder: 'collection id' },
    { key: 'topK', label: 'Top K', placeholder: '8' },
  ],
  tool: [
    { key: 'name', label: 'Tool name', placeholder: 'registry id' },
    { key: 'method', label: 'HTTP method', placeholder: 'GET | POST' },
    { key: 'endpoint', label: 'Endpoint (optional)', placeholder: 'https://…' },
  ],
  mcp: [
    { key: 'transport', label: 'Transport', placeholder: 'stdio | sse | http' },
    { key: 'serverUrl', label: 'URL (sse/http)', placeholder: 'https://host/mcp' },
    {
      key: 'command',
      label: 'Command (stdio)',
      placeholder: 'npx -y @org/mcp-server',
    },
    {
      key: 'tools',
      label: 'Tool allowlist',
      placeholder: 'comma-separated; empty = all',
    },
  ],
  condition: [
    {
      key: 'expression',
      label: 'Rule / expression',
      placeholder: 'e.g. riskScore > 0.7',
      rows: 2,
    },
  ],
  human: [
    { key: 'assignee', label: 'Assignee / role', placeholder: 'on-call' },
    { key: 'timeout', label: 'Timeout (sec)', placeholder: '86400' },
  ],
  parallel: [{ key: 'branches', label: 'Branch count', placeholder: '2' }],
  merge: [
    { key: 'strategy', label: 'Merge strategy', placeholder: 'all | any | first' },
  ],
  transform: [
    { key: 'language', label: 'Language', placeholder: 'jsonata | jq | jmespath' },
    {
      key: 'expression',
      label: 'Expression',
      placeholder: 'mapping or query',
      rows: 3,
    },
  ],
  guardrail: [
    { key: 'policyId', label: 'Policy id', placeholder: 'corp-default' },
    { key: 'action', label: 'On violation', placeholder: 'block | redact | log' },
  ],
  subflow: [
    { key: 'workflowId', label: 'Workflow id', placeholder: 'uuid or slug' },
    { key: 'version', label: 'Version', placeholder: 'latest | semver' },
  ],
  output: [
    { key: 'format', label: 'Output format', placeholder: 'json | text | sse' },
  ],
  custom: [
    {
      key: 'customType',
      label: 'Step type name',
      placeholder: 'e.g. Internal API, ETL, legacy script',
    },
    {
      key: 'definition',
      label: 'What this step does',
      placeholder: 'Describe behavior, contracts, inputs/outputs…',
      rows: 4,
    },
    {
      key: 'parameters',
      label: 'Parameters / config (freeform)',
      placeholder: 'key=value per line or any notes your team uses',
      rows: 3,
    },
  ],
};

export function InspectorConfigFields({ kind, config, onConfigChange }: Props) {
  const fields = SCHEMA[kind];
  if (!fields?.length) return null;

  return (
    <div className="inspector__config">
      <p className="inspector__config-title">Configuration</p>
      {fields.map((f) => (
        <label key={f.key} className="field">
          <span className="field__label">{f.label}</span>
          {f.rows && f.rows > 1 ? (
            <textarea
              className="field__input field__textarea"
              rows={f.rows}
              value={config?.[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => onConfigChange(f.key, e.target.value)}
            />
          ) : (
            <input
              className="field__input"
              value={config?.[f.key] ?? ''}
              placeholder={f.placeholder}
              onChange={(e) => onConfigChange(f.key, e.target.value)}
            />
          )}
        </label>
      ))}
    </div>
  );
}
