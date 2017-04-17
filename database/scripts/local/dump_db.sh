#!/usr/bin/env bash
DUMP_SCRIPT="mongodump -d test -o /dump"
rm -rf ./dump/test
docker exec just-married-db bash -c "eval $DUMP_SCRIPT"
