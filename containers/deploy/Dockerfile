FROM node:6.10.3
MAINTAINER gurgul.grzegorz@gmail.com

ARG ARTIFACT
ENV ARTIFACT=${ARTIFACT:-/artifacts/jmserver.tar}

ENV PROTOCOL=${PROTOCOL:-https}
ENV HOST=${HOST:-localhost}
ENV PORT=${PORT:-80}
ENV DOMAIN=${DOMAIN:-true}

ADD ${ARTIFACT} /app
WORKDIR /app

EXPOSE ${PORT}
ENTRYPOINT ["node", "index.js"]
