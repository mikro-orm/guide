FROM node:22.6.0-slim

WORKDIR /app

COPY . .

RUN npm ci && npm cache clean --force

RUN npm run build

ENTRYPOINT ["node","dist/server"]