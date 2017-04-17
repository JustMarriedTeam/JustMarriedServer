#!/usr/bin/env bash
DUMP_SCRIPT="mongodump -h ds141428.mlab.com:41428 -d heroku_wsm0k87c -u ggurgul -p ggurgul -o /dump"
docker exec just-married-db bash -c "eval $DUMP_SCRIPT"

