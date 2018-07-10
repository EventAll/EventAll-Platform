#!/bin/bash
echo "Deleting old Prisma service, generating new models, seeding DB"
if hash prisma 2>/dev/null; then
    prisma delete --force
    prisma deploy
    prisma seed
    echo "Finished reseting Prisma Service!"
else
    echo "Prisma CLI not installed"
fi

