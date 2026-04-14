import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type Database from 'better-sqlite3';
import type { AuthedRequest } from '../auth.js';
import type { createAuth } from '../auth.js';

export function authRouter(
  db: Database.Database,
  auth: ReturnType<typeof createAuth>
) {
  const r = Router();

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).max(120),
  });

  r.post('/login', (req, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
      return;
    }
    const { email, password } = parsed.data;
    const row = db
      .prepare(
        'SELECT id, email, password_hash, name FROM users WHERE email = ?'
      )
      .get(email.toLowerCase()) as
      | { id: number; email: string; password_hash: string; name: string }
      | undefined;

    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = auth.issueToken(row.id, row.email);
    res.json({
      token,
      user: { id: row.id, email: row.email, name: row.name },
    });
  });

  r.post('/register', (req, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
      return;
    }
    const { email, password, name } = parsed.data;
    const normalized = email.toLowerCase();
    const existing = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(normalized) as { id: number } | undefined;
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const hash = bcrypt.hashSync(password, 10);
    const info = db
      .prepare(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
      )
      .run(normalized, hash, name.trim());
    const token = auth.issueToken(Number(info.lastInsertRowid), normalized);
    res.status(201).json({
      token,
      user: {
        id: Number(info.lastInsertRowid),
        email: normalized,
        name: name.trim(),
      },
    });
  });

  r.get('/me', auth.requireAuth, (req: AuthedRequest, res: Response) => {
    const profile = auth.getUserProfile(req.user!.id);
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: profile });
  });

  return r;
}
