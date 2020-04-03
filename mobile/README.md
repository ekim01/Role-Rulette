This project was created using [expo](https://github.com/expo/expo) and [expo-cli](https://github.com/expo/expo-cli).

## To Run the app locally

See `npm start` command below to run the app with an emulator.

## Creating the APK (Building the App)

- Clone the repo, and install the dev environment (`npm install`)
- [Follow the guide here to create the APK](https://docs.expo.io/versions/latest/distribution/building-standalone-apps/)

#### Android APK

- First, run `npm start` to run the app locally
- While that's running, open another terminal window
- In the second terminal, run `expo build:android -t apk`
- Sign into expo (Can use our group credentials)
- Press 1 when prompted about the key store.
- Wait for the app to build (can take a while!)
- Download the apk by copying the link from the terminal, or signing into https://expo.io/dashboard/

## Available Scripts

In the mobile project directory, you can run:

### `npm start`

Runs the app in expo.<br />
This starts a local server for your app and gives you a url to it. <br />
Here you can either scan the qr code in the EXPO app on your mobile device to run the emulator on your device (iOS or Android), or run the app on your android emulator (You must have a working android emulator, you can set this up here: [React Native Getting started](https://reactnative.dev/docs/getting-started)), or iOS emulator. <br />
The page will reload if you make edits making it easy to work on during development.<br />

### `npm test`

Launches the test runner (Jest) in the interactive watch mode.<br />
\*\* If tests are failing due to not matching the snapshots, press `u` in the console (or run `npm test -- -u`), while running JEST, to update the snapshot.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

Creates Xcode and Android Studio projects for your app. Use this if you need to add custom native functionality. Learn more here [Ejecting to Bare Workflow](https://docs.expo.io/versions/v36.0.0/workflow/customizing/) <br />
You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Changing Target Server

The default target server is our production server at http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/. If you would like to test functionality or features that the target server has yet to implement, please run your own server and change TARGET_URL. <br />
To change the target server, go to /mobile/common/contants.js and change TARGET_URL to the server of your choice. Please note that this relies on the Role Roulette backend so your target server must be running the Roule Roulette server. <br />

## Learn More

You can learn more about starting a react native project with expo here [Expo documentation](https://docs.expo.io/versions/v36.0.0/get-started/create-a-new-app/).

To learn React Native, check out the [React Native](https://reactnative.dev/).
