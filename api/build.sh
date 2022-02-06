#!/bin/bash

./pre-build.sh

docker build -t scale8/api:latest .
