#!/bin/bash
docker run -d -v $PWD/prettify.hs:/prettify.hs --name haskell haskell:7 sleep infinity