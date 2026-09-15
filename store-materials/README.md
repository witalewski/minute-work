# Minute Work — store submission materials

Prepared 15 September 2026 from the current project, in English (en-US).

## Contents and readiness

| Material | Android | iOS | Status |
| --- | --- | --- | --- |
| Store copy | `Android/en-US/` | `iOS/en-US/` | Prepared; limits validated |
| Structured listing | `Android/listing.json` | `iOS/listing.json` | Owner fields marked with `{{...}}` |
| Store icon | `Android/graphics/` | `iOS/graphics/` | Opaque PNG exports of existing branding |
| Feature graphic | `Android/graphics/` | Not applicable | 1024 × 500 PNG and editable HTML source |
| Screenshot compositions | `Android/screenshots/preview-only/` | `iOS/screenshots/preview-only/` | Web previews; replace with native captures before uploading |
| Review notes | `Android/review-notes.txt` | `iOS/review-notes.txt` | Contact fields need completion |
| Privacy declarations | `Android/data-safety.md` | `iOS/app-privacy.md` | Source-based drafts; verify final binary/SDKs |
| Submission checklist | `Android/submission-checklist.md` | `iOS/submission-checklist.md` | Platform-specific remaining steps |
| Privacy/support pages | `shared/` | `shared/` | Drafts; owner details and public hosting needed |

## Required owner details

Fill `shared/owner-details.json`, then replace corresponding placeholders throughout this folder. The file is a worksheet, not an automatic substitution mechanism. Supply publisher identity, copyright owner, support and review contacts, public URLs, and the registered iOS bundle ID. Choose pricing, countries and target age groups in the consoles. A content rating is assigned from the store questionnaires; it is not an audience selection.

## Actual blockers found

- No Android device is connected and no Android virtual device is configured here.
- `xcrun simctl` is blocked by the unaccepted local Xcode license. The account owner must review and accept it in Xcode or their terminal before native capture/build work.
- iOS uses the template bundle identifier `org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)`. Register and configure a permanent identifier before uploading. `com.minutework.emomtimer` is a suggested choice, subject to availability and ownership.
- No public privacy/support URL was supplied, and the current app UI has no privacy-policy link. Host the completed policy and add an accessible in-app link before submission.
- No signed AAB/IPA or store submission is included. This folder prepares materials; it does not establish release-build readiness.

## Screenshots

Five layouts per platform show setup, running, paused, dark appearance and completion. They contain real captures of the shared React Native Web implementation, not native Android/iOS captures. All compositions are named `PREVIEW` and isolated under `preview-only`. Do not upload them as native screenshots. Font metrics, safe areas and system chrome can differ. See each screenshot README and `scripts/capture-native.sh` to complete the upload sets.

## Reproduction

`render-assets.cjs` uses Playwright and Sharp. Start the app with `npm run web -- --host 127.0.0.1 --port 3015`, then run `node store-materials/scripts/render-assets.cjs` with those dependencies available (or set `NODE_PATH` to a runtime containing them). It uses Chrome and the actual running app; its clock is advanced for captures without changing application code. `STORE_PREVIEW_URL` overrides the preview URL. Run `node store-materials/scripts/validate.cjs` for metadata and PNG checks.

See `sources.md` for official submission references. Promotional videos and translations are optional and not included. Apple’s standard EULA can be used unless the publisher chooses a custom agreement.
