#!/bin/bash

git pull && \
pwd
cd ../bill-frontend
pwd
git pull && \

docker-compose down
docker-compose up --build -d
