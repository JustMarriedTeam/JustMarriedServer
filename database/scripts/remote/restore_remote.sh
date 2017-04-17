#!/usr/bin/env bash
RESTORE_SCRIPT="mongorestore --drop -h ds141428.mlab.com:41428 -d heroku_wsm0k87c -u ggurgul -p ggurgul /dump/heroku_wsm0k87c"
docker exec just-married-db bash -c "eval $RESTORE_SCRIPT"

