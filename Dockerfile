FROM node:22.6.0-slim

WORKDIR /app

RUN apt-get update && apt-get install -y sqlite3 wget vim && apt-get clean

RUN wget -qO- "https://github.com/woile/sqlite-uuid/releases/download/0.4.0/libsqlite_uuid-$(uname -s)-$(uname -m).tar.gz" | tar xvz && \
    mv libsqlite_uuid.so /usr/lib/ && \
    touch ~/.sqliterc && \
    echo ".open kaardirakendus.db" >> ~/.sqliterc && \
    echo ".load libsqlite_uuid" >> ~/.sqliterc

COPY . .

RUN npm ci && npm cache clean --force

RUN chmod +x scripts/load_frontend_env.sh

RUN npm run build

#ENTRYPOINT ["./scripts/load_frontend_env.sh", "node", "dist/server"]
ENTRYPOINT ["node","dist/server"]