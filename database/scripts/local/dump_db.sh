#!/usr/bin/env bash
DUMP_SCRIPT="mongodump"
rm -rf ./data/dump
docker exec just-married-db bash -c "eval $DUMP_SCRIPT"
