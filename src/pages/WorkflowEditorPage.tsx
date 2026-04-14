import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';

import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { NodePalette } from '../components/NodePalette';
import { Inspector } from '../components/Inspector';
import { OfflineBanner } from '../components/OfflineBanner';
import { BrandRobotIcon } from '../components/BrandRobotIcon';
import { initialEdges, initialNodes } from '../data/initialWorkflow';
import {
  apiGetWorkflow,
  apiPutWorkflow,
  apiValidateWorkflow,
} from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { getDefaultConfigForKind } from '../lib/nodeDefaults';
import type { AgentEdge, AgentNode, AgentNodeData, WorkflowDocument } from '../types/workflow';

const WORKFLOW_KEY = 'awb_workflow_v1';

function isWorkflowDocument(x: unknown): x is WorkflowDocument {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return Array.isArray(o.nodes) && Array.isArray(o.edges);
}

export function WorkflowEditorPage() {
  const navigate = useNavigate();
  const { user, token, online, isOfflineGuest, logout } = useAuth();
  const [nodes, setNodes] = useState<AgentNode[]>(initialNodes);
  const [edges, setEdges] = useState<AgentEdge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<AgentNodeData | null>(null);
  const [validateStatus, setValidateStatus] = useState<string | null>(null);
  const [validateBusy, setValidateBusy] = useState(false);
  const [syncLabel, setSyncLabel] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (token && online && !isOfflineGuest) {
        try {
          const { document } = await apiGetWorkflow(token);
          if (cancelled) return;
          if (document && isWorkflowDocument(document)) {
            setNodes(document.nodes as AgentNode[]);
            setEdges(document.edges as AgentEdge[]);
            setHydrated(true);
            return;
          }
        } catch {
          /* use local */
        }
      }
      const raw = localStorage.getItem(WORKFLOW_KEY);
      if (raw) {
        try {
          const d = JSON.parse(raw) as unknown;
          if (isWorkflowDocument(d)) {
            setNodes(d.nodes as AgentNode[]);
            setEdges(d.edges as AgentEdge[]);
          }
        } catch {
          /* keep template */
        }
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [token, online, isOfflineGuest]);

  const workflowDoc = useMemo<WorkflowDocument>(
    () => ({
      name: 'Agent workflow',
      nodes,
      edges,
    }),
    [nodes, edges]
  );

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(WORKFLOW_KEY, JSON.stringify(workflowDoc));
      } catch {
        /* quota */
      }
      if (token && online && !isOfflineGuest) {
        setSyncLabel('Saving…');
        apiPutWorkflow(token, workflowDoc)
          .then(() => setSyncLabel('Synced'))
          .catch(() => setSyncLabel('Saved locally only'))
          .finally(() => {
            window.setTimeout(() => setSyncLabel(null), 2000);
          });
      } else {
        setSyncLabel('Local draft');
        window.setTimeout(() => setSyncLabel(null), 2000);
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [workflowDoc, token, online, isOfflineGuest, hydrated]);

  const onNodesChange = useCallback((changes: NodeChange<AgentNode>[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange<AgentEdge>[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onSelectNode = useCallback(
    (id: string | null, data: AgentNodeData | null) => {
      setSelectedId(id);
      setSelectedData(data);
    },
    []
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<AgentNodeData>) => {
      if (!selectedId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedId ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
      setSelectedData((d) => (d ? { ...d, ...patch } : null));
    },
    [selectedId]
  );

  const deleteNodeById = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedIdRef.current === id) {
      setSelectedId(null);
      setSelectedData(null);
    }
  }, []);

  const onNodesDelete = useCallback((deleted: AgentNode[]) => {
    const ids = new Set(deleted.map((n) => n.id));
    setEdges((eds) => eds.filter((e) => !ids.has(e.source) && !ids.has(e.target)));
    const sid = selectedIdRef.current;
    if (sid && ids.has(sid)) {
      setSelectedId(null);
      setSelectedData(null);
    }
  }, []);

  const duplicateNodeById = useCallback((id: string) => {
    const src = nodes.find((n) => n.id === id);
    if (!src) return;
    const newId = `n-${crypto.randomUUID().slice(0, 8)}`;
    const cfg = src.data.config;
    const node: AgentNode = {
      id: newId,
      type: src.type,
      position: { x: src.position.x + 56, y: src.position.y + 56 },
      data: {
        kind: src.data.kind,
        label: `${src.data.label} (copy)`,
        description: src.data.description,
        config: cfg ? { ...cfg } : undefined,
      },
    };
    setNodes((nds) => (nds.some((n) => n.id === id) ? [...nds, node] : nds));
    setSelectedId(newId);
    setSelectedData(node.data);
  }, [nodes]);

  const disconnectNodeEdges = useCallback((id: string) => {
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const copyNodeJson = useCallback((id: string) => {
    const n = nodes.find((x) => x.id === id);
    if (!n || !navigator.clipboard?.writeText) return;
    const payload = {
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    };
    void navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  }, [nodes]);

  const addNode = useCallback((kind: AgentNodeData['kind'], label: string) => {
    const id = `n-${crypto.randomUUID().slice(0, 8)}`;
    const jitter = 60 + Math.random() * 100;
    const node: AgentNode = {
      id,
      type: kind,
      position: { x: 280 + jitter, y: 180 + jitter },
      data: {
        kind,
        label,
        description: 'Configure in the inspector',
        config: getDefaultConfigForKind(kind),
      },
    };
    setNodes((ns) => [...ns, node]);
    setSelectedId(id);
    setSelectedData(node.data);
  }, []);

  const exportWorkflow = useCallback(() => {
    const blob = new Blob([JSON.stringify(workflowDoc, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [workflowDoc]);

  const validateRemote = useCallback(async () => {
    setValidateBusy(true);
    setValidateStatus(null);
    try {
      if (!token || isOfflineGuest) {
        setValidateStatus(
          'Sign in to run server-side validation. Structure looks fine locally.'
        );
        return;
      }
      if (!online) {
        setValidateStatus('Offline — connect to validate on the server.');
        return;
      }
      const res = await apiValidateWorkflow(token, workflowDoc);
      if (res.ok) {
        setValidateStatus(
          `Valid: ${res.nodeCount} nodes, ${res.edgeCount} edges.`
        );
      }
    } catch (e) {
      setValidateStatus(
        e instanceof Error ? e.message : 'Validation request failed'
      );
    } finally {
      setValidateBusy(false);
    }
  }, [token, online, isOfflineGuest, workflowDoc]);

  if (!user) return null;

  return (
    <div className="app-shell">
      <OfflineBanner />
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo" aria-hidden>
            <BrandRobotIcon className="brand-robot-icon" />
          </span>
          <div>
            <h1 className="topbar__title">Agent Workflow Builder</h1>
            <p className="topbar__tagline">
              {user.name} · {user.email}
            </p>
          </div>
        </div>
        <div className="topbar__actions">
          {syncLabel ? (
            <span className="topbar__status" role="status">
              {syncLabel}
            </span>
          ) : null}
          {validateStatus ? (
            <span className="topbar__status" role="status">
              {validateStatus}
            </span>
          ) : null}
          <Link to="/settings" className="btn btn--ghost topbar__link">
            Settings
          </Link>
          <Link to="/help" className="btn btn--ghost topbar__link">
            Help
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={validateRemote}
            disabled={validateBusy}
          >
            {validateBusy ? 'Checking…' : 'Validate'}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={exportWorkflow}
          >
            Export JSON
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="app-body">
        <NodePalette onAdd={addNode} />
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setEdges={setEdges}
          selectedId={selectedId}
          onSelectNode={onSelectNode}
          onDeleteNode={deleteNodeById}
          onNodesDelete={onNodesDelete}
          onDuplicateNode={duplicateNodeById}
          onDisconnectNodeEdges={disconnectNodeEdges}
          onCopyNodeJson={copyNodeJson}
        />
        <Inspector
          selectedId={selectedId}
          data={selectedData}
          onChange={updateSelectedNode}
        />
      </div>
    </div>
  );
}
