#!/bin/bash

if [[ ! -f /usr/libexec/PlistBuddy ]]; then
    exit 0
fi

PLIST=platforms/ios/*/*-Info.plist

cat << EOF |
Delete :NSPhotoLibraryUsageDescription
Add :NSPhotoLibraryUsageDescription string in order to allow you to add pictures from your library to the blog post that you are creating.
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done
