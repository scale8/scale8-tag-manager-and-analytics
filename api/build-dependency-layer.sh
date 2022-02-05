#!/bin/bash
set -x
set -e

OUTPUT_DIR="$(pwd)/layers-dist"

LAYER_DIR=$OUTPUT_DIR/nodejs

mkdir -p $LAYER_DIR

cp -LR node_modules $LAYER_DIR

cd $OUTPUT_DIR

zip -r layers.zip nodejs
