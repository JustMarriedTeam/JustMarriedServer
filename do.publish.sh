#!/usr/bin/env bash
docker login -u ${DOCKER_REGISTRY_USERNAME} -p ${DOCKER_REGISTRY_PASSWORD}
if [ "${BRANCH}" == "master" ]; then
  docker tag just-married/jmserver:production-latest justmarried/just-married-server:latest;
  docker push justmarried/just-married-server:latest;
else
  echo "Doing nothing for now";
fi
docker logout
