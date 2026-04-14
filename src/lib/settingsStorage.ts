export type McpTransport = 'stdio' | 'sse' | 'http';

export type McpServerProfile = {
  id: string;
  name: string;
  transport: McpTransport;
  /** stdio: executable + args string */
  command?: string;
  /** sse / http: base URL */
  url?: string;
  /** Optional bearer or header name hint (never store real secrets in demos) */
  authHint?: string;
  enabled: boolean;
  notes?: string;
};

export type AppSettings = {
  version: 1;
  /** Default model suggestion for new Agent nodes */
  defaultModel: string;
  autoSaveDrafts: boolean;
  /** Workflow validation strictness label */
  validationLevel: 'basic' | 'strict';
  /** User-defined MCP servers (used as templates; nodes still store their own overrides). */
  mcpServers: McpServerProfile[];
  /** Telemetry / analytics preference (local flag only in this app). */
  shareAnonymousUsage: boolean;
};

const STORAGE_KEY = 'awb_app_settings_v1';

const defaultSettings: AppSettings = {
  version: 1,
  defaultModel: 'gpt-4.1',
  autoSaveDrafts: true,
  validationLevel: 'basic',
  mcpServers: [],
  shareAnonymousUsage: false,
};

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings, mcpServers: [] };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      version: 1,
      mcpServers: Array.isArray(parsed.mcpServers) ? parsed.mcpServers : [],
    };
  } catch {
    return { ...defaultSettings, mcpServers: [] };
  }
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function createMcpProfile(partial: Partial<McpServerProfile> = {}): McpServerProfile {
  return {
    id: partial.id ?? `mcp-${crypto.randomUUID().slice(0, 8)}`,
    name: partial.name ?? 'New MCP server',
    transport: partial.transport ?? 'sse',
    command: partial.command,
    url: partial.url,
    authHint: partial.authHint,
    enabled: partial.enabled ?? true,
    notes: partial.notes,
  };
}
