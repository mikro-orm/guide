#!/bin/bash

OS=$(uname -s)
ARCH=$(uname -m)

wget -qO- "https://github.com/woile/sqlite-uuid/releases/download/0.4.0/libsqlite_uuid-${OS}-${ARCH}.tar.gz" | tar xvz
mv libsqlite_uuid.so /usr/lib/
touch ~/.sqliterc
echo ".open kaardirakendus.db" >> ~/.sqliterc
echo ".load libsqlite_uuid" >> ~/.sqliterc
echo ".mode box" >> ~/.sqliterc
echo ".headers on" >> ~/.sqliterc