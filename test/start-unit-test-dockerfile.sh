#!/bin/bash





sleep 10
npx prisma db push --accept-data-loss
npm run test
