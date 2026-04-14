import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

export type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
};

export function openDatabase(dbPath: string): Database.Database {
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workflows (
      user_id INTEGER PRIMARY KEY,
      document TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM users')
    .get() as { count: number };

  if (count === 0) {
    const passwordHash = bcrypt.hashSync('demo123', 10);
    db.prepare(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
    ).run('demo@example.com', passwordHash, 'Demo user');
  }

  return db;
}
