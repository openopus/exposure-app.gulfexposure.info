#!/bin/bash
# android-capture.sh: -*- Shell-script -*-  DESCRIPTIVE TEXT.
# 
#  Copyright (c) 2016 Brian J. Fox
#  Author: Brian J. Fox (bfox@opuslogica.com) Tue Oct  4 08:25:03 2016.
output="$1"
if [ ! "$output" ]; then output="screen.png"; fi
adb shell screencap -p | perl -pe 's/\x0D\x0A/\x0A/g' > $output
