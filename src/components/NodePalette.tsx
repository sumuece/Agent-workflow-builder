import type { AgentNodeData } from '../types/workflow';
import { PaletteIcon } from '../icons/PaletteIcons';

type PaletteItem = {
  kind: AgentNodeData['kind'];
  label: string;
  hint: string;
};

type PaletteSection = { title: string; items: PaletteItem[] };

const SECTIONS: PaletteSection[] = [
  {
    title: 'Start & finish',
    items: [
      { kind: 'trigger', label: 'Trigger', hint: 'Webhook, chat, schedule' },
      { kind: 'output', label: 'Output', hint: 'Response, callback, handoff' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { kind: 'agent', label: 'Agent', hint: 'LLM reasoning step' },
      { kind: 'memory', label: 'Memory', hint: 'RAG, history, KV store' },
      { kind: 'transform', label: 'Transform', hint: 'Map / parse / structure' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { kind: 'tool', label: 'Tool', hint: 'HTTP, function, SDK' },
      { kind: 'mcp', label: 'MCP server', hint: 'Model Context Protocol' },
    ],
  },
  {
    title: 'Control flow',
    items: [
      { kind: 'condition', label: 'Condition', hint: 'Branch on rules' },
      { kind: 'parallel', label: 'Parallel', hint: 'Fan-out branches' },
      { kind: 'merge', label: 'Merge', hint: 'Join branches' },
      { kind: 'subflow', label: 'Sub-workflow', hint: 'Nested graph' },
    ],
  },
  {
    title: 'Safety',
    items: [
      { kind: 'guardrail', label: 'Guardrail', hint: 'Policy & filters' },
      { kind: 'human', label: 'Human review', hint: 'Approval / HITL' },
    ],
  },
  {
    title: 'Custom',
    items: [
      {
        kind: 'custom',
        label: 'Custom step',
        hint: 'Your type name, definition, and parameters',
      },
    ],
  },
];

type NodePaletteProps = {
  onAdd: (kind: AgentNodeData['kind'], label: string) => void;
};

export function NodePalette({ onAdd }: NodePaletteProps) {
  return (
    <aside className="palette">
      <div className="palette__head">
        <span className="palette__title">Step library</span>
        <span className="palette__sub">
          Built-in steps plus custom nodes you name and document yourself.
        </span>
      </div>
      <div className="palette__scroll">
        {SECTIONS.map((section) => (
          <div key={section.title} className="palette__section">
            <h3 className="palette__section-title">{section.title}</h3>
            <ul className="palette__list">
              {section.items.map((item) => (
                <li key={item.kind}>
                  <button
                    type="button"
                    className={`palette__item palette__item--${item.kind}`}
                    onClick={() => onAdd(item.kind, item.label)}
                  >
                    <span className="palette__icon" aria-hidden>
                      <PaletteIcon kind={item.kind} />
                    </span>
                    <span className="palette__item-text">
                      <span className="palette__item-label">{item.label}</span>
                      <span className="palette__item-hint">{item.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
