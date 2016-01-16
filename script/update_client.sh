#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

APP_DIR=$DIR/../../FTClient
cd $APP_DIR && git pull  
MAKE_DIR=$APP_DIR/ProjectS/proj.android
cd $MAKE_DIR && ./build_native.sh && ant release


KEYSTORENAME="ft.keystore"
KEYSTOREPATH=$MAKE_DIR/$KEYSTORENAME
echo $KEYSTOREPATH
PASS=123456

TIME=$(date +%Y%m%d%H%I%S)
if [ ! -e "$KEYSTOREPATH" ]; then
    echo "aaa"
    keytool -genkey -alias $KEYSTORENAME -keyalg RSA -validity 20000 -keystore $KEYSTORENAME -dname "CN=Mark Smith, OU=JavaSoft, O=Sun, L=Cupertino,S=California, C=US" -storepass $PASS -keypass $PASS
fi

jarsigner -verbose -keystore $KEYSTORENAME -signedjar ./bin/FairyTails-release-signed-$TIME.apk ./bin/FairyTails-release-unsigned.apk $KEYSTORENAME -storepass $PASS -keypass $PASS

cp ./bin/FairyTails-release-signed-$TIME.apk $DIR/../public/FairyTails-release-signed.apk
