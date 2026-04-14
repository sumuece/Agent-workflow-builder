export type HelpArticle = {
  id: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
};

export const HELP_INDEX: { id: string; title: string; summary: string }[] = [
  {
    id: 'workflows',
    title: 'Workflows & node types',
    summary: 'How the canvas models triggers, agents, tools, MCP, and control flow.',
  },
  {
    id: 'mcp',
    title: 'MCP servers',
    summary: 'Connect Model Context Protocol servers and use them from Tool / MCP nodes.',
  },
  {
    id: 'settings',
    title: 'Settings',
    summary: 'Defaults, MCP profiles, privacy, and what is stored locally vs on the server.',
  },
  {
    id: 'sync',
    title: 'Sync & offline',
    summary: 'Signed-in sync, local drafts, and validation.',
  },
];

export const HELP_ARTICLES: Record<string, HelpArticle> = {
  workflows: {
    id: 'workflows',
    title: 'Workflows & node types',
    summary:
      'Build directed graphs where data flows left to right. Each node is a step your runtime can execute.',
    sections: [
      {
        heading: 'Core flow',
        body: 'Trigger starts a run. Agent nodes call an LLM with instructions. Output ends the run and returns results to your channel (chat, API, etc.).',
      },
      {
        heading: 'Context & tools',
        body: 'Memory nodes represent retrieval or conversation state. Tool nodes wrap HTTP or function calls. MCP server nodes declare a connection to an MCP-capable process or endpoint so downstream tools can list and invoke MCP tools.',
      },
      {
        heading: 'Control & safety',
        body: 'Condition branches on rules or scores. Parallel fans out to multiple branches; Merge waits and combines. Transform maps JSON or text. Guardrail enforces policies before sensitive steps. Human review pauses for approval. Sub-workflow delegates to another saved workflow.',
      },
      {
        heading: 'Custom steps',
        body: 'Use Custom steps when nothing in the library fits: set a step type name (shown on the node), describe what it does, and add freeform parameters or notes. They save in your workflow JSON like any other node for your runtime or docs to interpret.',
      },
    ],
  },
  mcp: {
    id: 'mcp',
    title: 'MCP servers',
    summary:
      'MCP (Model Context Protocol) exposes tools and resources to agents. This builder lets you model MCP as first-class steps.',
    sections: [
      {
        heading: 'MCP node vs Settings',
        body: 'Use an MCP node on the canvas for a specific connection in this workflow. Under Settings → MCP servers, save reusable profiles (name, transport, URL or command) that you can copy from when configuring nodes.',
      },
      {
        heading: 'Transports',
        body: 'stdio runs a local command. sse and http point to hosted MCP-compatible endpoints. Match the transport your server implementation expects.',
      },
      {
        heading: 'Security',
        body: 'Do not paste production API keys into shared workflows. Prefer environment-backed secrets in your execution environment and keep this UI for structure and documentation only.',
      },
    ],
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    summary: 'Control defaults and MCP templates stored in this browser.',
    sections: [
      {
        heading: 'General',
        body: 'Auto-save drafts keeps the canvas in local storage while you edit. Validation level affects how strictly the server checks exported graphs when you are signed in.',
      },
      {
        heading: 'Models',
        body: 'Default model is a hint for new Agent nodes. Your executor should map this string to the provider you use.',
      },
      {
        heading: 'MCP profiles',
        body: 'Profiles are saved only in local storage unless you extend the API. They help you standardize server names and URLs across workflows.',
      },
      {
        heading: 'Privacy',
        body: 'The offline guest mode never sends credentials to the API. When signed in, workflows sync to your account on the bundled API; review your deployment policy for production.',
      },
    ],
  },
  sync: {
    id: 'sync',
    title: 'Sync & offline',
    summary: 'Understand how drafts and server sync interact.',
    sections: [
      {
        heading: 'Signed in',
        body: 'With a valid session and network, the graph debounces to the API. Failures fall back to local draft storage.',
      },
      {
        heading: 'Offline',
        body: 'You can continue offline or use Continue offline on the login screen. Changes stay in local storage until you reconnect and sync.',
      },
      {
        heading: 'Validate',
        body: 'Validate checks graph shape on the server when online. It does not execute your workflow.',
      },
    ],
  },
};
