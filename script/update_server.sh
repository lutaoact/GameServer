#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

APP_DIR=$DIR/../
cd $APP_DIR && git pull  && make test-all color=-C

