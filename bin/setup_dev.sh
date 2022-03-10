#!/usr/bin/env bash

# This script brings up the application in a DEVELOPMENT ENVIRONMENT.
# All components are containerized with the exception of smart contract-related
# steps (i.e. bringing up a development network and deploying the contract).

echo "=== Bringing up development network ==="
# Install node modules (if necessary)
pushd smart_contract && npm install --silent
# Bring up `hardhat` development network
npx hardhat node &

echo "=== Deploying smart contract on development network ==="
# This also compiles the contract.
CONTRACT_ACCOUNT=$(npx hardhat run scripts/deploy.js --network localhost)
popd

echo "=== Bringing up client server ==="    
CONTRACT_ACCOUNT=${CONTRACT_ACCOUNT} docker-compose up
