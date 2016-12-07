#!/usr/bin/env bash
docker build -t kbhit/just-married-database .
docker rm just-married-db
docker run -it -p 27017:27017 --name just-married-db kbhit/just-married-database