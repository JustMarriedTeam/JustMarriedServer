#!/usr/bin/env bash
RESTORE_SCRIPT="mongorestore -d test /dump/test --drop"
docker exec just-married-db bash -c "eval $RESTORE_SCRIPT"

