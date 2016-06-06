#!/bin/sh

function start(){
    filename="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
    pid="log/server.pid"
    echo `date`": Starting Web server"
    sh whatismyip.sh
    nohup nodemon bin/www >> $filename  2>&1 &
    echo $! > $pid

}

function stop(){
    filename="log/server_log_`date "+%y_%m_%d_%H_%M_%S"`.log"
    pid="log/server.pid"
    echo `date`": Stopping Web server"
    kill -9 `cat $pid`
    for PID in `ps ax | grep "node" | awk ' {print $1;} '`; 
        do kill -9 $PID; 
    done
}

function usage() { 
    echo "Usage:\n $0 [-s start ]\n $0 [-x stop]" ; exit 1; 
}

f=1;

while getopts "sx" o; do
    case "${o}" in
        s)
            stop ;
            start ;
            ;;
        x)
            stop ;
            ;;
        *)
            usage ;
            ;;
    esac
    f=0;
done

if [ $f -eq 1 ]; then
    usage ;
fi
