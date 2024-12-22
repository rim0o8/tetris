FROM node:20.15.0-bullseye-slim as base

RUN mkdir -p /home/frontend

WORKDIR /home/frontend
COPY package*.json ./
COPY tsconfig*.json ./
COPY next.config.mjs ./
RUN npm install

# Installer stage
FROM base as installer
WORKDIR /home/frontend
COPY . .
RUN npm install

# Builder stage
FROM installer as builder
WORKDIR /home/frontend
RUN npm run build

# Final stage
FROM node:20.15.0-bullseye-slim as final
WORKDIR /home/frontend
COPY --from=builder /home/frontend ./
CMD ["npm", "run", "dev"]