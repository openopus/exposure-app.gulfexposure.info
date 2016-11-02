#!/bin/sh
export signing_pass="idtmp2tv"
name="Brian Fox"
org_unit="Research & Development"
org="Opus Logica Inc"
city="Santa Barbara"
state="California"
country="US"


if [ ! -e "lmprotocols.app.keystore" ]; then
    keytool -genkey -v -keystore lmprotocols.app.keystore -alias lmprotocols -keyalg RSA -keysize 2048 -validity 10000 >/dev/null <<EOF
$signing_pass
$signing_pass
$name
$org_unit
$org
$city
$state
$country
yes
EOF
    if [ ! -e "lmprotocols.app.keystore" ]; then
	echo "But I failed!  You'll have to figure this out manually :-("
	exit 1
    else
	echo "Got it - continuing build."
    fi
fi

ionic build android --release
cp ./platforms/android/build/outputs/apk/android-release-unsigned.apk ./lmprotocols-release-unsigned.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./lmprotocols.app.keystore -storepass:env signing_pass lmprotocols-release-unsigned.apk lmprotocols

zipalign -f 4 lmprotocols-release-unsigned.apk lmprotocols-release.apk

rm lmprotocols-release-unsigned.apk

echo "Your new store-ready apk is named 'lmprotocols-release.apk'"
