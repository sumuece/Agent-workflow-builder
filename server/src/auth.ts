import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type Database from 'better-sqlite3';

export type AuthedRequest = Request & {
  user?: { id: number; email: string };
};

export function createAuth(secret: string, db: Database.Database) {
  function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing bearer token' });
      return;
    }
    const token = header.slice(7);
    try {
      const decoded = jwt.verify(token, secret);
      const payload = decoded as unknown as { sub: number; email: string };
      if (typeof payload.sub !== 'number' || typeof payload.email !== 'string') {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  function issueToken(userId: number, email: string): string {
    return jwt.sign({ sub: userId, email }, secret, { expiresIn: '7d' });
  }

  function getUserProfile(userId: number) {
    return db
      .prepare(
        'SELECT id, email, name, created_at FROM users WHERE id = ?'
      )
      .get(userId) as
      | { id: number; email: string; name: string; created_at: string }
      | undefined;
  }

  return { requireAuth, issueToken, getUserProfile };
}
