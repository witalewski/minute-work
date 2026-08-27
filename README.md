# Minute Work

A minimal every-minute-on-the-minute (EMOM) workout timer built with React Native.

- Rock provides the native React Native toolchain.
- Re.Pack/Rspack replaces Metro for the iOS JavaScript bundle.
- React Native Web reuses the same app UI in a browser, compiled directly with Rspack.
- Uniwind and Tailwind CSS provide shared utility-class styling on native and web.

## Requirements

- Node.js 24.20.0 (LTS)
- Xcode with an iOS Simulator runtime
- CocoaPods

## Run on web

```sh
npm install
npm run web
```

Open <http://localhost:3000>. To create a production bundle, run `npm run build:web`.

Uniwind artifacts are generated automatically by the npm scripts and Rspack
configs. Run `npm run generate:styles` directly when another tool needs them.

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
npm run lint
npm test -- --runInBand
npm run build:web
```
