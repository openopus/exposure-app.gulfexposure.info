#!/bin/bash

if [[ ! -f /usr/libexec/PlistBuddy ]]; then
    exit 0
fi

PLIST=platforms/ios/*/*-Info.plist

cat << EOF |
Delete :ITSAppUsesNonExemptEncryption
Add :ITSAppUsesNonExemptEncryption bool false
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done
