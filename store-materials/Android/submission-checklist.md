# Android submission checklist

1. Complete Play Console identity/account/device verification and choose distribution countries/pricing.
2. Confirm permanent package ID `com.minutework.emomtimer`. Current versionName is `1.0`, versionCode `1`, target SDK `36`.
3. Create/back up upload keystore; configure `ROCK_UPLOAD_STORE_FILE`, `ROCK_UPLOAD_STORE_PASSWORD`, `ROCK_UPLOAD_KEY_ALIAS`, `ROCK_UPLOAD_KEY_PASSWORD` outside source control.
4. Complete public privacy/support drafts and add the in-app privacy link.
5. Create the Play Console app and paste `en-US` fields; use `listing.json` as a worksheet, not a direct console import.
6. Upload `graphics/store-icon-512.png` and `graphics/feature-graphic-1024x500.png`.
7. Capture native Android screenshots using `screenshots/README.md`; do not upload `preview-only` assets.
8. Complete App content using `data-safety.md`; choose target ages and complete the health declaration and content-rating questionnaire.
9. From project root run `npm run generate:styles`, then `cd android` and `./gradlew bundleRelease`. Expected AAB: `android/app/build/outputs/bundle/release/app-release.aab` relative to project root.
10. Enable Play App Signing, upload to internal testing, check pre-launch results, native-library/16 KB page-size compatibility and all console errors. Test the store-installed build with `shared/testing-plan.md`.
11. If this is a personal account created after 13 November 2023: run a closed test with at least 12 continuously opted-in testers for 14 days, collect real feedback, then apply for production access.
12. Add release notes, review every field, submit for production review and publish after approval. Increase versionCode for later uploads.

Do not include keystores, passwords or service-account credentials in this materials folder. No build or native test has been certified by this checklist.
