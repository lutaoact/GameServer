#!bin/sh

ACTION=$1

get_pid() {
    if [ -f ./run/app.pid ]; then
        echo `cat ./run/app.pid`
    fi
}

usage() {
    echo 'Usage: ./appctl.sh {start|stop|restart}'
    exit 1;
}

start() {
    pid=`get_pid`
    if [ ! -z $pid ]; then
        echo 'server is already running'
    else
        make server
    fi
}

stop() {
    pid=`get_pid`
    if [ -z $pid ]; then
        echo 'server is not running'
    else
        echo 'server is stopping ...'
        kill -15 $pid
        echo 'server stopped'
    fi
}

restart() {
    stop
    sleep 1
    echo ===============
    start
}

case "$ACTION" in
    start)
        start
    ;;
    stop)
        stop
    ;;
    restart)
        restart
    ;;
    *)
        usage
    ;;
esac
