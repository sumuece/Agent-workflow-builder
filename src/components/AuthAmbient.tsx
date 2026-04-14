import type { AgentNodeKind } from '../types/workflow';
import { PaletteIcon } from '../icons/PaletteIcons';

const LEFT_CHIPS: {
  c: AgentNodeKind;
  t: string;
  m: string;
}[] = [
  { c: 'trigger', t: 'Trigger', m: 'auth-ambient__chip--a' },
  { c: 'agent', t: 'Agent', m: 'auth-ambient__chip--b' },
  { c: 'mcp', t: 'MCP', m: 'auth-ambient__chip--c' },
  { c: 'tool', t: 'Tool', m: 'auth-ambient__chip--d' },
  { c: 'memory', t: 'Memory', m: 'auth-ambient__chip--e' },
];

/**
 * Decorative, non-interactive motion for the login screen (pointer-events: none).
 * Flow lines suggest steps converging on the Output “door” at the right.
 */
export function AuthAmbient() {
  return (
    <div className="auth-ambient" aria-hidden>
      <svg className="auth-ambient__mesh" viewBox="0 0 400 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="amb-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(124,108,240,0.15)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.08)" />
          </linearGradient>
        </defs>
        <path
          className="auth-ambient__mesh-path"
          d="M0 120 Q100 80 200 120 T400 120 M0 200 Q120 160 240 200 T400 200 M0 280 Q80 240 200 280 T400 280"
          fill="none"
          stroke="url(#amb-line)"
          strokeWidth="0.6"
        />
      </svg>

      {/* Flow toward the output door (viewBox 0–100 = full viewport) */}
      <svg
        className="auth-ambient__flow"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="auth-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(124, 108, 240, 0.35)" />
            <stop offset="55%" stopColor="rgba(167, 139, 250, 0.25)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.45)" />
          </linearGradient>
        </defs>
        <path
          className="auth-ambient__flow-path"
          d="M 7 50 Q 38 44 76 33"
          fill="none"
          stroke="url(#auth-flow-grad)"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="auth-ambient__flow-path auth-ambient__flow-path--2"
          d="M 33 44 Q 50 40 76 32.5"
          fill="none"
          stroke="url(#auth-flow-grad)"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="auth-ambient__flow-path auth-ambient__flow-path--3"
          d="M 21 58 Q 44 48 75.5 34"
          fill="none"
          stroke="url(#auth-flow-grad)"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="auth-ambient__flow-path auth-ambient__flow-path--4"
          d="M 41 54 Q 54 44 77 33"
          fill="none"
          stroke="url(#auth-flow-grad)"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="auth-ambient__flow-path auth-ambient__flow-path--5"
          d="M 11 72 Q 36 52 75 35"
          fill="none"
          stroke="url(#auth-flow-grad)"
          strokeWidth={1.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="auth-ambient__chips">
        {LEFT_CHIPS.map((x) => (
          <span key={x.c} className={`auth-ambient__chip ${x.m}`}>
            <span
              className={`auth-ambient__chip-icon auth-ambient__chip-icon--${x.c}`}
            >
              <PaletteIcon kind={x.c} />
            </span>
            {x.t}
          </span>
        ))}
      </div>

      <div className="auth-ambient__robot auth-ambient__robot--1">
        <RobotA />
      </div>
      <div className="auth-ambient__robot auth-ambient__robot--2">
        <RobotB />
      </div>
      <div className="auth-ambient__robot auth-ambient__robot--3">
        <RobotA />
      </div>
      <div className="auth-ambient__robot auth-ambient__robot--4">
        <RobotB />
      </div>

      <div className="auth-ambient__door">
        <div className="auth-ambient__door-glow" />
        <div className="auth-ambient__door-frame">
          <span className="auth-ambient__door-label">Exit</span>
          <span className="auth-ambient__chip auth-ambient__chip--door">
            <span className="auth-ambient__chip-icon auth-ambient__chip-icon--output">
              <PaletteIcon kind="output" />
            </span>
            Output
          </span>
          <span className="auth-ambient__door-sill" />
        </div>
      </div>
    </div>
  );
}

function RobotA() {
  return (
    <svg viewBox="0 0 64 72" className="auth-ambient__robot-svg" fill="none">
      <g className="auth-ambient__robot-bob">
        <rect x="22" y="6" width="20" height="14" rx="4" fill="#8b7ae8" opacity="0.92" />
        <circle cx="28" cy="13" r="2" fill="#0c0c14" />
        <circle cx="36" cy="13" r="2" fill="#0c0c14" />
        <rect
          x="12"
          y="24"
          width="8"
          height="20"
          rx="4"
          fill="rgba(124,108,240,0.35)"
          stroke="rgba(167,139,250,0.45)"
          strokeWidth="1"
        />
        <rect
          x="44"
          y="24"
          width="8"
          height="20"
          rx="4"
          fill="rgba(124,108,240,0.35)"
          stroke="rgba(167,139,250,0.45)"
          strokeWidth="1"
        />
        <rect
          x="18"
          y="22"
          width="28"
          height="32"
          rx="6"
          fill="rgba(18,18,28,0.85)"
          stroke="rgba(124,108,240,0.45)"
          strokeWidth="1"
        />
        <rect x="24" y="56" width="8" height="14" rx="2" fill="rgba(124,108,240,0.35)" />
        <rect x="32" y="56" width="8" height="14" rx="2" fill="rgba(124,108,240,0.35)" />
      </g>
    </svg>
  );
}

function RobotB() {
  return (
    <svg viewBox="0 0 56 64" className="auth-ambient__robot-svg auth-ambient__robot-svg--b" fill="none">
      <g className="auth-ambient__robot-bob">
        <ellipse
          className="auth-ambient__robot-dome"
          cx="28"
          cy="10"
          rx="14"
          ry="8"
          fill="rgba(34,211,238,0.25)"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1"
        />
        <rect x="12" y="16" width="32" height="28" rx="8" fill="rgba(12,14,22,0.9)" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
        <circle cx="22" cy="28" r="3" fill="#22d3ee" opacity="0.6" />
        <circle cx="34" cy="28" r="3" fill="#22d3ee" opacity="0.6" />
        <rect x="20" y="44" width="6" height="16" rx="2" fill="rgba(34,211,238,0.3)" />
        <rect x="30" y="44" width="6" height="16" rx="2" fill="rgba(34,211,238,0.3)" />
      </g>
    </svg>
  );
}
