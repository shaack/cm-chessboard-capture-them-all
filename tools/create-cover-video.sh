#!/bin/bash
cd "$(dirname "$0")/.."
lsof -ti:8084 | xargs kill -9 2>/dev/null
sleep 1
sudo nice -n -10 node tools/create-cover-video.js "$@"
