# The Exposure

## Quick Start

The remainder of this document breaks down all the information that
you might need to develop the app.  However, for those of you like me,
with short attention spans and very little patience:

 - Prerequisites
    brew install node
    npm install -g ionic cordova ios-deploy cordova-icon cordova-splash gulp bower
    npm install -g node-gyp

 - Starting with working dev environment
    npm install
    ionic setup sass
    ionic state restore
    ionic serve

- To build for iOS or store..
    ionic prepare
    open platforms/ios/TheExposure.xcodeproj
    <build in xcode>

The `prepare` step is necessary every time you change the code, and then want to build native.  `ionic run ios` does this for you automatically.

# HELP!  I got the white-screen-o-death!

Read the previous quick start section.  You didn't `ionic prepare`.

# I need to update the icon/splashscreen?

Modify the image(s) resources/icon.png and resources/splash.png.  Then run

    ionic resources

# Dad-Blast-It!  I can't find some header files when compiling with xcode...

 - open platforms/ios/TheExposure.xcodeproj
 - Go to Xcode -> Preferences -> Locations -> Advanced
 - Choose "Unique" as the option for Build Location
 - Menu Product -> Clean
 - Menu Product -> Build

# Double-Dad-Blast-It!  Now I can't find header files when archiving...

  - Go to Build Settings -> Header Search Paths
  - Add "$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include"

# To install all of the plugins listed in package.json:

  ionic state restore

## Installing dependencies

We are using bower to manage libraries. To add a library, do:

    $ bower install foolib --save

Then add and commit the files to git.


## Cordova

To install android/ios:

  $ ionic platform add android
  $ ionic platform add ios

Then to run do

  $ ionic run android

  or

  $ ionic run ios

  then build in xcode

If you have an iOS device, build directly onto that device with:

   $ ionic run --device ios

- BUILDING FOR THE STORE

-- Apple store:

  Run:

    $ ionic build ios --release

  Then open the project in xcode and check that the settings are correct:

    Code Signing Identity: Iphone Developer: YOUR NAME (e.g. "IPhone Developer: Brian J.  Fox (blahblah)")
    Provisioning Profile: iOSTeam Provisioning Profile: *

  Finally, archive (Product > Archive) and upload to itunes.

-- Google play store:

First, copy the theexposure-app.keystore file to this directory from the git@git.opuslogica.com:android-artifacts git repository.
Then run:

    $ ./build-for-android-store.sh

