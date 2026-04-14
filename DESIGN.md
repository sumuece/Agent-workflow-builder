# Agent Workflow Builder — UI design (Linear-inspired)

This project follows the [Stitch DESIGN.md](https://github.com/VoltAgent/awesome-design-md) pattern. Token names align with the **Linear** entry in [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (ultra-minimal product UI, purple accent, precise hierarchy). Upstream full specs may live on [getdesign.md](https://getdesign.md) per brand folders in that collection.

## 1. Visual theme

Dark-first engineering surface. High contrast text, restrained borders, no ornamental chrome. Density: comfortable for long sessions.

## 2. Color palette

| Token | Hex | Role |
| --- | --- | --- |
| `--bg-canvas` | `#0c0c0f` | Main background |
| `--bg-elevated` | `#141417` | Panels, node bodies |
| `--bg-muted` | `#1a1a1f` | Inputs, nested surfaces |
| `--border-subtle` | `#2a2a32` | Dividers, node outlines |
| `--border-strong` | `#3f3f4a` | Focus rings |
| `--text-primary` | `#f4f4f5` | Primary copy |
| `--text-secondary` | `#a1a1aa` | Labels, hints |
| `--text-tertiary` | `#71717a` | Meta, disabled |
| `--accent` | `#5e6ad2` | Primary actions, selection, edges |
| `--accent-muted` | `#3d4578` | Hover backgrounds |
| `--success` | `#4cc38a` | Valid / running |
| `--warning` | `#f5a623` | Conditions |
| `--danger` | `#eb5757` | Errors |

## 3. Typography

- **UI**: Inter, system-ui fallback.
- **Scale**: 11px meta, 12px labels, 13px body, 15px section titles, 18px page title.
- **Weight**: 400 body, 500 labels, 600 titles. Tight letter-spacing on uppercase labels (0.04em).

## 4. Components

- **Buttons**: Pill or 6px radius; primary filled `--accent`; ghost with border `--border-subtle`.
- **Nodes**: 8px radius, 1px border, subtle shadow only on drag/hover.
- **Inputs**: Dark fill `--bg-muted`, 1px `--border-subtle`, focus ring `--accent`.

## 5. Layout

8px base grid. Sidebar 260px, inspector 320px, canvas fluid. Toolbar height 48px.

## 6. Depth

Minimal shadow: `0 1px 0 rgba(255,255,255,0.04) inset` on inputs; nodes use border not heavy elevation.

## 7. Do / don’t

- Do use semantic tokens above, not raw hex in components.
- Don’t use axios in this codebase; use native `fetch` (see `src/lib/api.ts`).

## 8. Responsive

Desktop-first; side panels stack below 1024px width.

## 9. Agent prompt guide

> Build a dark Linear-style agent workflow editor: purple `#5e6ad2` accents, Inter, minimal borders, node graph with triggers, LLM steps, tools, and branching.
