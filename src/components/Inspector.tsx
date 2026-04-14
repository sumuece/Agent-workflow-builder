import { NODE_KIND_LABELS, type AgentNodeData } from '../types/workflow';
import { InspectorConfigFields } from './InspectorConfigFields';

type InspectorProps = {
  selectedId: string | null;
  data: AgentNodeData | null;
  onChange: (patch: Partial<AgentNodeData>) => void;
};

export function Inspector({ selectedId, data, onChange }: InspectorProps) {
  if (!selectedId || !data) {
    return (
      <aside className="inspector inspector--empty">
        <div className="inspector__empty-art" aria-hidden />
        <p className="inspector__empty-title">No step selected</p>
        <p className="inspector__empty-body">
          Choose a node to edit labels, description, and kind-specific settings.
        </p>
      </aside>
    );
  }

  const setConfig = (key: string, value: string) => {
    onChange({
      config: { ...data.config, [key]: value },
    });
  };

  return (
    <aside className="inspector">
      <header className="inspector__head">
        <span className="inspector__eyebrow">Step</span>
        <h2 className="inspector__title">{data.label}</h2>
        <span className="inspector__badge">{NODE_KIND_LABELS[data.kind]}</span>
      </header>
      <div className="inspector__fields">
        <label className="field">
          <span className="field__label">Display name</span>
          <input
            className="field__input"
            value={data.label}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </label>
        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            className="field__input field__textarea"
            rows={3}
            value={data.description ?? ''}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </label>
        <InspectorConfigFields
          kind={data.kind}
          config={data.config}
          onConfigChange={setConfig}
        />
      </div>
    </aside>
  );
}
