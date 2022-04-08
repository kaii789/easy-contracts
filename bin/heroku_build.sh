#!/usr/bin/env bash

# This is solely used by Heroku.

pushd smart_contract && npm install --include dev && npx hardhat compile
popd
pushd client && npm install && npm run-script build
