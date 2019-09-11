#!/bin/bash

set -e

DATA_FOLDER=$1
echo $DATA_FOLDER
live-server --port=8081 --cors --no-browser $DATA_FOLDER &
npm run start
