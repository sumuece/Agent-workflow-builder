import type { AgentNodeData } from '../types/workflow';

const common = {
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function PaletteIcon({ kind }: { kind: AgentNodeData['kind'] }) {
  switch (kind) {
    case 'trigger':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'agent':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
          <path d="M12 12v6M9 10h6" opacity="0.6" />
        </svg>
      );
    case 'memory':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" opacity="0.65" />
        </svg>
      );
    case 'tool':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'mcp':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="3" y="4" width="18" height="6" rx="2" />
          <rect x="3" y="14" width="18" height="6" rx="2" opacity="0.55" />
          <path d="M8 10v4M16 10v4" opacity="0.45" />
        </svg>
      );
    case 'condition':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 12h16M12 4v16" opacity="0.35" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'human':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
        </svg>
      );
    case 'parallel':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M12 4v4M12 10v4M12 16v4" />
          <path d="M8 8h8M6 12h12M8 16h8" opacity="0.5" />
        </svg>
      );
    case 'merge':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M8 4v6l4 4 4-4V4M8 20h8" opacity="0.85" />
        </svg>
      );
    case 'transform':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M4 7h6l4 10h6" />
          <circle cx="4" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="20" cy="17" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'guardrail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
          <path d="M9 12l2 2 4-4" opacity="0.75" />
        </svg>
      );
    case 'subflow':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 9h6M9 12h6M9 15h4" opacity="0.55" />
        </svg>
      );
    case 'output':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <path d="M7 17L17 7M17 7H9M17 7v8" />
        </svg>
      );
    case 'custom':
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" opacity="0.35" />
          <path d="M12 8v8M8 12h8" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
