#!/bin/bash

if [[ ! -f /usr/libexec/PlistBuddy ]]; then
    exit 0
fi

PLIST=platforms/ios/*/*-Info.plist

cat << EOF |
Delete :NSLocationWhenInUseUsageDescription
Add :NSLocationWhenInUseUsageDescription string This helps us to automatically answer questions about your city and state.
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done
