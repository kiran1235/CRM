#!/bin/sh

filename="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
echo `date`": Starting Web server"
sh whatismyip.sh
`nohup nodemon bin/www >> $filename  2>&1 &`


