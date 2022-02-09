#!/bin/bash

git pull && \
pwd
cd ../bill-frontend
pwd
git pull && \
cd ../bill-backend

docker-compose down
docker-compose up --build -d
