#!/bin/sh

filename="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
pid="log/server.pid"
echo `date`": Stopping Web server"
sudo kill -9 `cat $pid`
