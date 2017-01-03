#!/usr/bin/env bash
RESTORE_SCRIPT="mongorestore"
docker exec just-married-db bash -c "eval $RESTORE_SCRIPT"

