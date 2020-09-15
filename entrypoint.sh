#!/bin/bash
npm install
npm run build
setsid npm run start  >/dev/null 2>&1 < /dev/null &

