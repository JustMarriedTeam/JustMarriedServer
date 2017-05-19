web: docker run
  -p $PORT:$PORT
  -e port=$PORT \
  -e session.secret=$SESSION_SECRET \
  -e memcached.servers=$MEMCACHEDCLOUD_SERVERS \
  -e memcached.username=$MEMCACHEDCLOUD_USERNAME \
  -e memcached.password=$MEMCACHEDCLOUD_PASSWORD \
  ${ARTIFACT_NAME}
