# Dockerfile for backend.

# Note: we use the Node official image (as opposed to our existing `development-container`) 
# to keep the container running our dev backend lightweight. 
# An extra bonus is that the image that the dev backend runs on could be a different architecture
# than the architecture for the development container (which is fixed to amd64).
FROM node:16

WORKDIR /var/app/backend

COPY package*.json ./

# Install dependencies
RUN npm install --silent --production

EXPOSE 3000

CMD npm start
