import { Router, type Response } from 'express';
import { z } from 'zod';
import type Database from 'better-sqlite3';
import type { AuthedRequest } from '../auth.js';
import type { createAuth } from '../auth.js';

const nodeSchema = z
  .object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.unknown()),
  })
  .passthrough();

const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })
  .passthrough();

const documentSchema = z.object({
  name: z.string().optional(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

const putSchema = z.object({
  document: documentSchema,
});

export function workflowsRouter(
  db: Database.Database,
  auth: ReturnType<typeof createAuth>
) {
  const r = Router();
  r.use(auth.requireAuth);

  r.get('/', (req: AuthedRequest, res: Response) => {
    const row = db
      .prepare(
        'SELECT document, updated_at FROM workflows WHERE user_id = ?'
      )
      .get(req.user!.id) as { document: string; updated_at: string } | undefined;

    if (!row) {
      res.json({ document: null, updatedAt: null });
      return;
    }
    try {
      const document = JSON.parse(row.document) as unknown;
      res.json({ document, updatedAt: row.updated_at });
    } catch {
      res.status(500).json({ error: 'Stored workflow is corrupt' });
    }
  });

  r.post('/validate', (req: AuthedRequest, res: Response) => {
    const parsed = z.object({ document: documentSchema }).safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: 'Invalid workflow document',
        details: parsed.error.flatten(),
      });
      return;
    }
    const { nodes, edges } = parsed.data.document;
    res.json({
      ok: true,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    });
  });

  r.put('/', (req: AuthedRequest, res: Response) => {
    const parsed = putSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid document', details: parsed.error.flatten() });
      return;
    }
    const json = JSON.stringify(parsed.data.document);
    db.prepare(
      `INSERT INTO workflows (user_id, document, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         document = excluded.document,
         updated_at = datetime('now')`
    ).run(req.user!.id, json);

    const updated = db
      .prepare('SELECT updated_at FROM workflows WHERE user_id = ?')
      .get(req.user!.id) as { updated_at: string };

    res.json({ ok: true, updatedAt: updated.updated_at });
  });

  return r;
}
