#!/usr/bin/env bash
docker run -it -p 27017:27017 -v $(pwd)/data:/data -v $(pwd)/dump:/dump --name just-married-db mongo:3.4.3
