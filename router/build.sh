#!/bin/bash

# Clean up...
rm -rf ../ui/build

yarn --cwd ../ui export

rsync -a --delete ../ui/out/ ui-build

docker build -t scale8/router:latest .
