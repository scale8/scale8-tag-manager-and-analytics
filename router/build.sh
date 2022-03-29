#!/bin/bash

# Clean up...
rm -rf ../ui/build

NEXT_PUBLIC_IS_ROUTER_MODE="true" yarn --cwd ../ui export

rsync -a --delete ../ui/out/ ui-build
