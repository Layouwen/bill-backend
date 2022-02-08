#!/bin/bash

git pull
cd ../frontend
git pull
docker-compose up --build -d
