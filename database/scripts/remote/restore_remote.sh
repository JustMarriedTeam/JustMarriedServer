#!/usr/bin/env bash
RESTORE_SCRIPT="mongorestore -h ds141428.mlab.com:41428 -d heroku_wsm0k87c -u ggurgul -p ggurgul /dump/staging"
docker exec just-married-db bash -c "eval $RESTORE_SCRIPT"

