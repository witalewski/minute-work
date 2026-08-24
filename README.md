# Minute Work

A minimal every-minute-on-the-minute (EMOM) workout timer built with React Native.

- Rock provides the native React Native toolchain.
- Re.Pack/Rspack replaces Metro for the iOS JavaScript bundle.
- React Native Web reuses the same app UI in a browser, compiled directly with Rspack.

## Requirements

- Node.js 20 or newer
- Xcode with an iOS Simulator runtime
- CocoaPods

## Run on web

```sh
npm install
npm run web
```

Open <http://localhost:3000>. To create a production bundle, run `npm run build:web`.

## Run on iOS

Install the native dependencies once:

```sh
cd ios && pod install && cd ..
```

Start the Re.Pack development server in one terminal:

```sh
npm start
```

Then build and launch the app in another terminal:

```sh
npm run ios
```

## Checks

```sh
npm run typecheck
npm test -- --runInBand
npm run build:web
```
