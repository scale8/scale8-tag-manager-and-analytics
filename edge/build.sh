#!/bin/bash

./mvnw package

docker build -t scale8/edge:latest .
