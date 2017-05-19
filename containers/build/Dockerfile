# This dockerfile creates a container the application is built in
FROM node:6.10.3

ARG ENVIRONMENT
ARG VERSION

ENV ENVIRONMENT=${ENVIRONMENT:-production}
ENV VERSION=${VERSION:-latest}
ENV OUTPUT_DIR=${OUTPUT_DIR:-/artifacts}

ENV ARTIFACT_NAME="jmserver-${ENVIRONMENT}-${VERSION}"

COPY containers/build/build.entrypoint.sh /build.entrypoint.sh
COPY / /app
VOLUME ${OUTPUT_DIR}

ENTRYPOINT ["/build.entrypoint.sh"]
