#!/bin/bash

# Clean up...
rm -rf dist/

# Compile the latest core code...
yarn platforms:build

# Compile...
yarn tsc

# Include assets in dist/api - tsc doesn't pick these up automatically
cp -R ./src/twig/views ./dist/api/src/twig/views
cp -R ./assets ./dist/api/assets
cp -R ./platform-builds ./dist/api/platform-builds

docker build -t scale8/api:latest .
