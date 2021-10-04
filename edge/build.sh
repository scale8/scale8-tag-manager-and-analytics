#!/bin/bash

./mvnw clean install

./mvnw clean package

docker build -t scale8/edge:latest .
