import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { openDatabase } from './db.js';
import { createAuth } from './auth.js';
import { authRouter } from './routes/auth.js';
import { workflowsRouter } from './routes/workflows.js';

const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-only-change-JWT_SECRET-in-production';
const DATABASE_PATH = process.env.DATABASE_PATH || './data/app.db';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

if (!process.env.JWT_SECRET) {
  console.warn(
    '[api] JWT_SECRET not set; using insecure default for development only.'
  );
}

const db = openDatabase(DATABASE_PATH);
const auth = createAuth(JWT_SECRET, db);

const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agent-workflow-builder-api' });
});

app.use('/api/auth', authRouter(db, auth));
app.use('/api/workflows', workflowsRouter(db, auth));

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
