#!/usr/bin/env bash
DUMP_SCRIPT="mongodump"
docker exec just-married-db bash -c "eval $DUMP_SCRIPT"
