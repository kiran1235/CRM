#!/bin/sh

# created by Kiran Talapaku 
# run this script to start postgres server

echo "Setting PostgreSQL Environment Variables"
cd ~/PostgreSQL/9.3/
./pg_env.sh

cd ~/PostgreSQL/9.3/scripts/
./serverctl.sh $1