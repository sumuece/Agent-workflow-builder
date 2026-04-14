#!/usr/bin/env bash
# Start the Agent Workflow Builder API and Vite dev server together.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed or not on PATH." >&2
  exit 1
fi

if [ ! -d "${ROOT}/node_modules" ] || [ ! -d "${ROOT}/server/node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
  echo "Installing server dependencies..."
  (cd "${ROOT}/server" && npm install)
fi

echo ""
echo "  API → http://localhost:4000   (health: /api/health)"
echo "  App → http://localhost:5173"
echo "  Press Ctrl+C to stop both processes."
echo ""

exec npm run dev
