#!/bin/bash

git pull
pwd
cd ../frontend
pwd
git pull

docker-compose down
docker-compose up --build -d
