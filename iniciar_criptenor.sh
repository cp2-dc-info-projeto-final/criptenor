#!/bin/bash
cd "$(dirname "$0")/web"
npm run dev &
node server/server.cjs