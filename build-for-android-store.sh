#!/bin/sh

if [ "$1" == "--sign-only" ]; then
    sign_only=true
fi

if [ ! -e "theexposure.app.keystore" ]; then
    echo "Keystore file theexposure.app.keystore is not in directory."
    echo "I will attempt to get the android-artifacts git repo in order to find it."
    ( cd ../;
      if [ ! -d android-artifacts ]; then git clone git@git.opuslogica.com:android-artifacts; fi
    )
    cp ../android-artifacts/theexposure.app.keystore .
    cp ../android-artifacts/theexposure.app.password .
    if [ ! -e "theexposure.app.keystore" ]; then
	echo "But I failed!  You'll have to figure this out manually :-("
	exit 1
    else
	echo "Got it - continuing build."
    fi
fi

if [ ! "$sign_only" ]; then
    ionic build android --release
    cp ./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk ./TheExposure-release-unsigned.apk
fi

if [ -r ./theexposure.app.password ]; then
    signing_pass=$(cat ./theexposure.app.password)
elif [ -r ./android-artifacts/theexposure.app.password ]; then
    signing_pass=$(cat ./android-artifacts/theexposure.app.password)
elif [ -r ../android-artifacts/theexposure.app.password ]; then
    signing_pass=$(cat ../android-artifacts/theexposure.app.password)
else
    echo "Couldn't find the file containing the signing password.  Intelligently guessing..."
    signing_pass="idtmp2tv"
fi
export signing_pass

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./theexposure.app.keystore -storepass:env signing_pass TheExposure-release-unsigned.apk exposure

zipalign -f 4 TheExposure-release-unsigned.apk TheExposure-release.apk

rm TheExposure-release-unsigned.apk

echo "Your new store-ready apk is named 'TheExposure-release.apk'"
