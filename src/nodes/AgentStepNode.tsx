import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AgentNodeData } from '../types/workflow';
import { PaletteIcon } from '../icons/PaletteIcons';

const kindMeta: Record<AgentNodeData['kind'], { glow: string }> = {
  trigger: { glow: 'rgba(251, 191, 36, 0.55)' },
  agent: { glow: 'rgba(157, 143, 255, 0.55)' },
  memory: { glow: 'rgba(56, 189, 248, 0.5)' },
  tool: { glow: 'rgba(52, 211, 153, 0.55)' },
  mcp: { glow: 'rgba(167, 139, 250, 0.55)' },
  condition: { glow: 'rgba(251, 146, 60, 0.5)' },
  human: { glow: 'rgba(244, 114, 182, 0.5)' },
  parallel: { glow: 'rgba(94, 234, 212, 0.45)' },
  merge: { glow: 'rgba(129, 140, 248, 0.5)' },
  transform: { glow: 'rgba(250, 204, 21, 0.45)' },
  guardrail: { glow: 'rgba(248, 113, 113, 0.45)' },
  subflow: { glow: 'rgba(147, 197, 253, 0.5)' },
  output: { glow: 'rgba(34, 211, 238, 0.5)' },
  custom: { glow: 'rgba(192, 132, 252, 0.55)' },
};

export function AgentStepNode({ data, selected }: NodeProps) {
  const d = data as AgentNodeData;
  const meta = kindMeta[d.kind];
  const kindLabel =
    d.kind === 'custom'
      ? (d.config?.customType?.trim() || 'custom')
      : d.kind;

  return (
    <div
      className={`agent-node${selected ? ' agent-node--selected' : ''}`}
      data-kind={d.kind}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="agent-handle"
        style={{ boxShadow: `0 0 14px ${meta.glow}` }}
      />
      <div className="agent-node__kind">
        <span className="agent-node__icon-wrap" aria-hidden>
          <PaletteIcon kind={d.kind} />
        </span>
        <span className="agent-node__kind-label">{kindLabel}</span>
      </div>
      <div className="agent-node__body">
        <div className="agent-node__title">{d.label}</div>
        {d.description ? (
          <div className="agent-node__desc">{d.description}</div>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="agent-handle"
        style={{ boxShadow: `0 0 14px ${meta.glow}` }}
      />
    </div>
  );
}
