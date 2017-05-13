FROM node:6.10.3
MAINTAINER gurgul.grzegorz@gmail.com

ARG ARTIFACT
ENV ARTIFACT=${ARTIFACT:-/artifacts/jmserver-production-latest.tar}

ADD ${ARTIFACT} /app
WORKDIR /app

EXPOSE 2701
ENTRYPOINT ["node", "index.js"]
