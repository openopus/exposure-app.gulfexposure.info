#!/bin/bash
# 030_update_content_src.sh: -*- Shell-script -*-  DESCRIPTIVE TEXT.
# 
#  Copyright (c) 2016 Brian J. Fox
#  Author: Brian J. Fox (bfox@opuslogica.com) Mon Mar 28 15:19:18 2016.
exit 0
targets="platforms/android/res/xml/config.xml platforms/ios/*/config.xml"
android_src="index.html"
ios_src="http://localhost:16382"

for target in $targets; do
    words=($(echo $target | tr '/' ' '))
    platform=${words[1]}
    if [ -r $target ]; then
	src=$(echo $(eval echo \$${platform}_src))
	rep=$(echo $src | sed 's/[\/&]/\\&/g')
	echo "Updating config.xml for $platform with $src"
	sed -i "" -e "s/<preference name=\"AlternateContentSrc\".*$/<preference name=\'AlternateContentSrc\' value=\'$rep\' \/>/" $target
	sed -i "" -e "s/<content src=.*$/<content src=\'$rep\' \/>/" $target
    fi
done
