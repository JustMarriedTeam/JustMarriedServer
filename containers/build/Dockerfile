# This dockerfile creates a container the application is built in
FROM node:6.10.3

ARG OUTPUT_DIR
ARG ARTIFACT_NAME

ENV OUTPUT_DIR=${OUTPUT_DIR:-/artifacts}
ENV ARTIFACT_NAME=${ARTIFACT_NAME:-jmserver}

COPY containers/build/build.cmd.sh /build.cmd.sh
RUN chmod +x /build.cmd.sh

# Make a separate layer out of package.json to ensure dependencies are reinstalled only if package.json changes
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir /app && cp -a /tmp/node_modules /app/

WORKDIR /app
COPY / /app

VOLUME ${OUTPUT_DIR}

CMD ["/build.cmd.sh"]
