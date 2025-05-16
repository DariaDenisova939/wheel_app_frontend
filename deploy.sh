#!/bin/bash

git pull origin main || exit 1

docker stop react-app || true
docker rm react-app || true

docker build -t react-app . || exit 1

docker run -d -p 80:80 --name react-app react-app || exit 1