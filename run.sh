#!/bin/bash

set -e

DATA_FOLDER=$1
echo $DATA_FOLDER
node node_modules/live-server/live-server.js --port=8081 --cors --no-browser $DATA_FOLDER &
npm run start

