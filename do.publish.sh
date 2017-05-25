#!/usr/bin/env bash
docker login -u ${DOCKER_REGISTRY_USERNAME} -p ${DOCKER_REGISTRY_PASSWORD}
if [ "${BRANCH}" == "master" ]; then
  docker push justmarried/just-married-server:latest;
else
  echo "Doing nothing for now";
fi
docker logout
