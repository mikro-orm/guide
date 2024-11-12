FROM node:22.6.0-slim

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3 wget vim && apt-get clean

COPY . .

RUN npm ci && npm cache clean --force

RUN chmod +x scripts/load_frontend_env.sh && \
    chmod +x scripts/download_and_install_sqlite.sh

#After copiyng, change the server URL values accordingly, inside the container
RUN ./scripts/download_and_install_sqlite.sh && \
    ./scripts/load_frontend_env.sh

RUN npm run build

ENTRYPOINT ["node", "dist/server"]