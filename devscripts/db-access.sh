#!/bin/bash
echo "Attaching to the Postgres instance"
docker exec -it eventall-platform_postgres_1  psql -U prisma
