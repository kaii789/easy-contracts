# Development

## Prerequisites

- Docker

Note: You would also need Metamask installed in your browser for most interactions with the app, but it is not necessary to have Metamask to deploy the app in development.

## Getting started

This project includes a bootstrap script that sets up the entire application in development mode.

To test out the application, simply execute `bin/bootstrap` from the project root directory.

### Development Container

The Dockerfile for this image is located at [`.devcontainer/Dockerfile`](../.devcontainer/Dockerfile).

This container contains all the tools and packages you would need to hack on the entire application (with the exception of local node modules, which you will need to `npm install` in the corresponding directory).

### `bin/bootstrap`

This script makes it easy to quickly bring up the entire application and is useful for playing around and testing out the application quickly.

Specifically, it:
1. Builds the development container.
2. Runs the container in detached mode in the background.
    - The entire project directory is bind mounted to the `/workspaces` directory in the container.
    - The Docker socket in the container is bind mounted to the host's Docker socket. This makes it possible to execute Docker commands to the host from the container (i.e. executing Docker commands from within the container actually instructs the container's Docker client to connect to the host's Docker engine).
    - Port `8454` in the container are forwarded to the same ports on the host machine.
3. Executes the `bin/setup.sh` script in the container.

The development container will be kept running and will remain available. So, for example, to get a Bash prompt inside the container, you can run:

```
docker exec -it blocx-development-container /bin/bash
```

NOTE: steps 1 and 2 essentially contain all the commands necessary for the "Setup" part of the [suggested workflow](#suggested-workflow).

### `bin/setup.sh`

This script essentially automates commands that a developer would run to bring everything up.

Specifically, it:
1. Starts a development ethereum network via `npx hardhat node`.
2. Deploys the smart contract on the development network.
3. Brings up the rest of the app via `docker-compose`:
    - react client (served on port `5001` in a development server)

## Suggested workflow

### Setup

1. Build development container.
2. Create and start development container, along with necessary bind mounts so the container has access to the source code located on the host. Also forward necessary ports.
    - It is recommended to also bind mount the Docker socket to use "Docker from Docker".
    - Be sure to include the environment variable `HOST_PROJECT_ROOT` and set it to be the path to the project root dir in your host.
    - See [`bin/bootstrap`](../bin/bootstrap).
3. Get a bash prompt into the container to execute commands during development.

Alternatively, the `.devcontainer/` directory also contains a `devcontainer.json` config file (which automates the above) for use with Visual Studio Code's `remote-containers` extension. See the [`remote-containers` documentation](https://code.visualstudio.com/docs/remote/containers-tutorial) for more details.

### Hacking on `smart_contract/`

First, enter the `smart_contract/` directory and `npm install` the necessary packages.

Now you should have access to the `hardhat` CLI tool, and you can start up a development ethereum network by entering:
```
npx hardhat node
```
This will list out 20 test accounts (along with their public keys and private keys) with some ETH for testing.

In a new terminal/shell, compile and deploy the smart contract on the newly brought up network by:
```
npx hardhat run scripts/deploy.js --network localhost
```
This will output the contract account for the deployed contract. **You will need to provide this value to the client in order for it to connect to your deployed smart contract!**
The ABI for this contract will be output directly into `client/src/contract_artifacts/` for use by the client.

You will need to redeploy the contract each time you make changes.

See the [Hardhat documentation](https://hardhat.org/getting-started/) for more details.

### Hacking on `client/` and `backend/`

You will need to provide the _contract account_ of a deployed smart contract through the `REACT_APP_CONTRACT_ACCOUNT` environment variable. The rest of the application can be brought up using:
```
REACT_APP_CONTRACT_ACCOUNT=<smart contract account id> docker-compose up
```
A React development server will be spun up in development mode to serve the front end at `localhost:5001`.
Hot-reloading is supported; simply make your front end edits in your code editor and changes should be rendered automatically. 

If new packages are installed, you would need to rebuild the container images:
```
docker-compose build
```

Once you are done, you can remove the containers with `docker-compose down`.
Database-related volumes will be created and persisted for future use. If you would like to bring down those volumes, as well, use the `-v` flag. Similarly, the container images can be removed with `--rmi`. E.g `docker-compose down -v --rmi all`. 
