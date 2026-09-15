# iOS submission checklist

1. Complete Apple Developer Program enrollment and App Store Connect agreements. Supply publisher, review contact, copyright and public URLs.
2. Review/accept the installed Xcode license; this currently blocks simulator tools here. Check Apple's current supported Xcode/SDK upload requirements.
3. Replace template `PRODUCT_BUNDLE_IDENTIFIER` in the Xcode project with your registered identifier; confirm signing team, capabilities and provisioning. Current marketing version is `1.0`, build `1`.
4. Confirm intended supported devices in Xcode. No explicit TARGETED_DEVICE_FAMILY was found in the project file; check resolved build settings before deciding whether iPad screenshots are required.
5. Host completed privacy/support pages and add an accessible in-app privacy link.
6. Create the App Store Connect record. Use the registered bundle ID and suggested SKU `minute-work-ios`. Paste `en-US` metadata and enter support/privacy URLs and copyright.
7. The 1024 icon is already part of the app asset catalog; `graphics/app-store-icon-1024.png` is a matching materials export. Apple normally derives the store icon from the uploaded build.
8. Capture native iPhone screenshots; see `screenshots/README.md`. Add native iPad captures if supporting iPad. Do not upload the web previews.
9. Complete App Privacy, age-rating questionnaire, content rights, export compliance and any applicable trader/territory requirements. Use `app-privacy.md` as a draft, not a certification.
10. Archive a Release build in Xcode, validate and upload to App Store Connect. Increase build number for subsequent uploads. Resolve all validation/SDK/privacy-manifest warnings.
11. Test with TestFlight and `shared/testing-plan.md`; use `testflight-notes.txt` for tester instructions. External beta testing may require beta review.
12. Select the tested build, paste review notes and real review contacts, confirm no sign-in required, choose release timing and submit for review.

The initial release does not need a promotional video. `release-notes.txt` is available for TestFlight/release communications and later version updates; only fill fields the console requests for the initial version.
