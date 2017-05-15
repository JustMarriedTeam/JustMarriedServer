#!/usr/bin/env bash

COMPOSE_FILE=$1
CONTAINER_NAME=$2

CONTAINER_ID=$(docker-compose -f ${COMPOSE_FILE} ps | grep ${CONTAINER_NAME} | cut -d" " -f 1)

DUMP_SCRIPT="mongodump -d test -o /dump"
rm -rf ../dump/test

docker exec ${CONTAINER_ID} bash -c "eval $DUMP_SCRIPT"
