#!/bin/bash
set -u
set -e

BUCKET=$2

if [ $# -gt 0 ]; then
    PKG=$(basename $PWD).zip
    FUN=$1; shift;

    if [ -n "$BUCKET" ]; then
        aws s3 cp $PKG s3://$BUCKET/$PKG
        aws lambda update-function-code --function-name $FUN --s3-bucket $BUCKET --s3-key $PKG
    else
        aws lambda update-function-code --function-name $FUN --zip-file fileb://$PKG 
    fi

else
    echo $0 function_name
fi

echo "Remember to increase lambda timeout from default 3 sec! It's not too much."
echo "Review env.json and run ./configure.sh function_name"
