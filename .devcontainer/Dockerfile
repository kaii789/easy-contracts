# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.217.4/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="16-bullseye"
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Install additional OS packages.
# python-pip3: For instally Python packages.
# Docker CLI v20.10.12, Docker Compose v2.2.3: For using Docker-out-of-Docker.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install \
    python3-pip \
    ca-certificates curl gnupg lsb-release \
    libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang make build-essential \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update && apt-get -y install docker-ce-cli="5:20.10.12~3-0~debian-bullseye"
# Install Docker Compose v2.2.3.
RUN curl -sSL "https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Install Python packages.
# vyper: Vyper compiler
RUN pip install vyper

# Install global node modules (locally). This way, we don't need a `devDependencies` field in `package.json`.
# RUN su node -c "npm install -g <foobar>"
