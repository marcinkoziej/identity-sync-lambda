#!/bin/bash
set -u
set -e

if [ "$#" -gt 0 -a "${1:-}" = "-u" ]; then
    mode=up
else
    mode=all
fi

PKG=$(basename $PWD).zip

if [ $mode = all ]; then
    yarn install
    zip -r9 $PKG node_modules
fi

zip -r $PKG index.js src


