#!/bin/bash
cd "$(dirname "$0")/web"
npm run dev -- --host &
node server/server.cjs
