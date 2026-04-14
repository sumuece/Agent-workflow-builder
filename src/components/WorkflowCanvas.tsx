import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  type Connection,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AgentStepNode } from '../nodes/AgentStepNode';
import type { AgentEdge, AgentNode, AgentNodeData, AgentNodeKind } from '../types/workflow';

const KINDS: AgentNodeKind[] = [
  'trigger',
  'agent',
  'memory',
  'tool',
  'mcp',
  'condition',
  'human',
  'parallel',
  'merge',
  'transform',
  'guardrail',
  'subflow',
  'output',
  'custom',
];

const nodeTypes: NodeTypes = Object.fromEntries(
  KINDS.map((k) => [k, AgentStepNode])
) as NodeTypes;

type NodeMenuState = {
  x: number;
  y: number;
  nodeId: string;
  label: string;
} | null;

type WorkflowCanvasProps = {
  nodes: AgentNode[];
  edges: AgentEdge[];
  onNodesChange: OnNodesChange<AgentNode>;
  onEdgesChange: OnEdgesChange<AgentEdge>;
  setEdges: React.Dispatch<React.SetStateAction<AgentEdge[]>>;
  selectedId: string | null;
  onSelectNode: (id: string | null, data: AgentNodeData | null) => void;
  onDeleteNode: (id: string) => void;
  onNodesDelete: (deleted: AgentNode[]) => void;
  onDuplicateNode: (id: string) => void;
  onDisconnectNodeEdges: (id: string) => void;
  onCopyNodeJson: (id: string) => void;
};

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  selectedId,
  onSelectNode,
  onDeleteNode,
  onNodesDelete,
  onDuplicateNode,
  onDisconnectNodeEdges,
  onCopyNodeJson,
}: WorkflowCanvasProps) {
  const [nodeMenu, setNodeMenu] = useState<NodeMenuState>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === selectedId,
      })),
    [nodes, selectedId]
  );

  const closeNodeMenu = useCallback(() => setNodeMenu(null), []);

  useEffect(() => {
    if (!nodeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNodeMenu();
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('.workflow-node-context-menu')) return;
      closeNodeMenu();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [nodeMenu, closeNodeMenu]);

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: AgentNode) => {
      event.preventDefault();
      onSelectNode(node.id, node.data as AgentNodeData);
      const data = node.data as AgentNodeData;
      setNodeMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
        label: data.label,
      });
    },
    [onSelectNode]
  );

  const onPaneClick = useCallback(() => {
    closeNodeMenu();
    onSelectNode(null, null);
  }, [closeNodeMenu, onSelectNode]);

  const menuPosition = useMemo(() => {
    if (!nodeMenu) return null;
    const pad = 8;
    const mw = 220;
    const mh = 320;
    const x = Math.min(nodeMenu.x, window.innerWidth - mw - pad);
    const y = Math.min(nodeMenu.y, window.innerHeight - mh - pad);
    return { left: Math.max(pad, x), top: Math.max(pad, y) };
  }, [nodeMenu]);

  const menuHasEdges =
    nodeMenu !== null &&
    edges.some(
      (e) => e.source === nodeMenu.nodeId || e.target === nodeMenu.nodeId
    );

  const menuPortal =
    nodeMenu && menuPosition
      ? createPortal(
          <div
            className="workflow-node-context-menu"
            style={{
              position: 'fixed',
              left: menuPosition.left,
              top: menuPosition.top,
              zIndex: 10000,
            }}
            role="menu"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="workflow-node-context-menu__title" title={nodeMenu.label}>
              {nodeMenu.label.length > 28
                ? `${nodeMenu.label.slice(0, 26)}…`
                : nodeMenu.label}
            </div>
            <button
              type="button"
              className="workflow-node-context-menu__item workflow-node-context-menu__item--default"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateNode(nodeMenu.nodeId);
                closeNodeMenu();
              }}
            >
              Duplicate step
            </button>
            <button
              type="button"
              className="workflow-node-context-menu__item workflow-node-context-menu__item--default"
              role="menuitem"
              disabled={!menuHasEdges}
              onClick={(e) => {
                e.stopPropagation();
                if (!menuHasEdges) return;
                onDisconnectNodeEdges(nodeMenu.nodeId);
                closeNodeMenu();
              }}
            >
              Remove all connections
            </button>
            <button
              type="button"
              className="workflow-node-context-menu__item workflow-node-context-menu__item--default"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                onCopyNodeJson(nodeMenu.nodeId);
                closeNodeMenu();
              }}
            >
              Copy step as JSON
            </button>
            <div className="workflow-node-context-menu__sep" role="separator" />
            <button
              type="button"
              className="workflow-node-context-menu__item workflow-node-context-menu__item--danger"
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(nodeMenu.nodeId);
                closeNodeMenu();
              }}
            >
              Delete step
            </button>
            <p className="workflow-node-context-menu__hint">
              Tip: Delete / Backspace removes the selected step.
            </p>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="workflow-canvas">
      {menuPortal}
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Delete', 'Backspace']}
        onNodesDelete={onNodesDelete}
        onNodeClick={(_, node) => {
          onSelectNode(node.id, node.data as AgentNodeData);
        }}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.25}
          color="rgba(124, 108, 240, 0.14)"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={() => '#9d8fff'}
          maskColor="rgba(12,12,15,0.85)"
          style={{ background: '#141417' }}
        />
      </ReactFlow>
    </div>
  );
}
