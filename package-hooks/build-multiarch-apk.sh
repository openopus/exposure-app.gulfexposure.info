# build-multiarch-apk.sh: -*- Shell-script -*-  DESCRIPTIVE TEXT.
# 
#  Copyright (c) 2016 Brian J. Fox
#  Author: Brian J. Fox (bfox@opuslogica.com) Thu Oct 20 18:10:51 2016.
if [ -d ./platforms/android ]; then
    echo "cdvBuildMultipleApks=false" >./platforms/android/build-extras.gradle
fi
