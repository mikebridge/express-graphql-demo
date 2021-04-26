#!/usr/bin/env sh

set -e

#echo "CREATING DB $POSTGRES_DB"
#createdb "$POSTGRES_DB"

echo "CREATING EXTENSION uuid-ossp on $POSTGRES_DB"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" \
  --dbname="$POSTGRES_DB"<<-EOSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
