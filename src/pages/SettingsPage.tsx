import { useCallback, useState } from 'react';
import { SubpageLayout } from '../components/SubpageLayout';
import {
  createMcpProfile,
  loadAppSettings,
  saveAppSettings,
  type AppSettings,
  type McpServerProfile,
} from '../lib/settingsStorage';

type Tab = 'general' | 'models' | 'mcp' | 'privacy';

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general');
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  const commit = useCallback((next: AppSettings) => {
    setSettings(next);
    saveAppSettings(next);
  }, []);

  const patch = useCallback(
    (partial: Partial<AppSettings>) => {
      commit({ ...settings, ...partial });
    },
    [settings, commit]
  );

  const updateMcp = useCallback(
    (id: string, partial: Partial<McpServerProfile>) => {
      const mcpServers = settings.mcpServers.map((m) =>
        m.id === id ? { ...m, ...partial } : m
      );
      patch({ mcpServers });
    },
    [settings.mcpServers, patch]
  );

  const addMcp = useCallback(() => {
    patch({
      mcpServers: [...settings.mcpServers, createMcpProfile()],
    });
  }, [settings.mcpServers, patch]);

  const removeMcp = useCallback(
    (id: string) => {
      patch({
        mcpServers: settings.mcpServers.filter((m) => m.id !== id),
      });
    },
    [settings.mcpServers, patch]
  );

  return (
    <SubpageLayout title="Settings">
      <div className="settings-layout">
        <div className="settings-tabs" role="tablist" aria-label="Settings sections">
          {(
            [
              ['general', 'General'],
              ['models', 'Models'],
              ['mcp', 'MCP servers'],
              ['privacy', 'Privacy'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={
                tab === id ? 'settings-tab settings-tab--active' : 'settings-tab'
              }
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {tab === 'general' ? (
            <section className="settings-section" aria-labelledby="set-gen">
              <h2 id="set-gen" className="settings-section__title">
                General
              </h2>
              <p className="settings-section__lead">
                Preferences stored in this browser. They do not sync to the API unless
                you extend the backend.
              </p>
              <label className="settings-check">
                <input
                  type="checkbox"
                  checked={settings.autoSaveDrafts}
                  onChange={(e) => patch({ autoSaveDrafts: e.target.checked })}
                />
                <span>Auto-save workflow drafts locally while editing</span>
              </label>
              <label className="field settings-field">
                <span className="field__label">Validation level</span>
                <select
                  className="field__input"
                  value={settings.validationLevel}
                  onChange={(e) =>
                    patch({
                      validationLevel: e.target.value as AppSettings['validationLevel'],
                    })
                  }
                >
                  <option value="basic">Basic graph checks</option>
                  <option value="strict">Strict (recommended for CI)</option>
                </select>
              </label>
            </section>
          ) : null}

          {tab === 'models' ? (
            <section className="settings-section" aria-labelledby="set-mod">
              <h2 id="set-mod" className="settings-section__title">
                Models
              </h2>
              <p className="settings-section__lead">
                Default model id applied to new Agent nodes. Your executor maps this to
                a provider.
              </p>
              <label className="field settings-field">
                <span className="field__label">Default model</span>
                <input
                  className="field__input"
                  value={settings.defaultModel}
                  placeholder="gpt-4.1"
                  onChange={(e) => patch({ defaultModel: e.target.value })}
                />
              </label>
            </section>
          ) : null}

          {tab === 'mcp' ? (
            <section className="settings-section" aria-labelledby="set-mcp">
              <h2 id="set-mcp" className="settings-section__title">
                MCP server profiles
              </h2>
              <p className="settings-section__lead">
                Reusable templates for Model Context Protocol servers. Reference them
                when configuring MCP nodes on the canvas.
              </p>
              <button type="button" className="btn btn--primary settings-add" onClick={addMcp}>
                Add profile
              </button>
              <ul className="mcp-profile-list">
                {settings.mcpServers.length === 0 ? (
                  <li className="mcp-profile-empty">No profiles yet.</li>
                ) : null}
                {settings.mcpServers.map((m) => (
                  <li key={m.id} className="mcp-profile-card">
                    <div className="mcp-profile-card__head">
                      <label className="field settings-field mcp-inline">
                        <span className="field__label">Name</span>
                        <input
                          className="field__input"
                          value={m.name}
                          onChange={(e) => updateMcp(m.id, { name: e.target.value })}
                        />
                      </label>
                      <label className="settings-check mcp-enabled">
                        <input
                          type="checkbox"
                          checked={m.enabled}
                          onChange={(e) => updateMcp(m.id, { enabled: e.target.checked })}
                        />
                        <span>Enabled</span>
                      </label>
                      <button
                        type="button"
                        className="btn btn--ghost mcp-remove"
                        onClick={() => removeMcp(m.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <label className="field settings-field">
                      <span className="field__label">Transport</span>
                      <select
                        className="field__input"
                        value={m.transport}
                        onChange={(e) =>
                          updateMcp(m.id, {
                            transport: e.target.value as McpServerProfile['transport'],
                          })
                        }
                      >
                        <option value="stdio">stdio</option>
                        <option value="sse">SSE</option>
                        <option value="http">HTTP</option>
                      </select>
                    </label>
                    {m.transport === 'stdio' ? (
                      <label className="field settings-field">
                        <span className="field__label">Command</span>
                        <input
                          className="field__input"
                          value={m.command ?? ''}
                          placeholder="npx -y @vendor/mcp-server"
                          onChange={(e) => updateMcp(m.id, { command: e.target.value })}
                        />
                      </label>
                    ) : (
                      <label className="field settings-field">
                        <span className="field__label">URL</span>
                        <input
                          className="field__input"
                          value={m.url ?? ''}
                          placeholder="https://host/mcp"
                          onChange={(e) => updateMcp(m.id, { url: e.target.value })}
                        />
                      </label>
                    )}
                    <label className="field settings-field">
                      <span className="field__label">Auth hint (no secrets)</span>
                      <input
                        className="field__input"
                        value={m.authHint ?? ''}
                        placeholder="e.g. Bearer from env MCP_TOKEN"
                        onChange={(e) => updateMcp(m.id, { authHint: e.target.value })}
                      />
                    </label>
                    <label className="field settings-field">
                      <span className="field__label">Notes</span>
                      <textarea
                        className="field__input field__textarea"
                        rows={2}
                        value={m.notes ?? ''}
                        onChange={(e) => updateMcp(m.id, { notes: e.target.value })}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === 'privacy' ? (
            <section className="settings-section" aria-labelledby="set-priv">
              <h2 id="set-priv" className="settings-section__title">
                Privacy
              </h2>
              <p className="settings-section__lead">
                This demo stores MCP profiles and preferences in{' '}
                <strong>local storage</strong>. Workflow graphs sync to the API only when
                you are signed in and online.
              </p>
              <label className="settings-check">
                <input
                  type="checkbox"
                  checked={settings.shareAnonymousUsage}
                  onChange={(e) => patch({ shareAnonymousUsage: e.target.checked })}
                />
                <span>Allow anonymous usage analytics (placeholder — not implemented)</span>
              </label>
              <p className="settings-note">
                For production, add a privacy policy link and never store API keys in node
                config or settings JSON exports.
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </SubpageLayout>
  );
}
