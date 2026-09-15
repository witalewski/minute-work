# Apple App Privacy — draft

Proposed label: **Data Not Collected**, based on the current app source. No analytics, ads, accounts, tracking, HealthKit or publisher network upload was found. The existing `ios/EmomTimer/PrivacyInfo.xcprivacy` declares no collected data and no tracking.

Before confirming:

- Inspect the final archive and embedded SDK privacy manifests; the source manifest is not proof of every dependency's behavior.
- Verify release network behavior. Development-server traffic is not a production feature.
- Review support-email handling against Apple's collection definitions and optional-disclosure rules.
- Confirm the declared required-reason API purposes actually match the shipped dependencies. Do not remove required-reason entries solely because no personal data is collected.
- Complete and publish the privacy policy; enter the public URL and add an accessible in-app link.
- No ATT permission prompt is proposed because no tracking was found. Reassess if tracking is added.

Age rating: answer the current questionnaire from actual functionality. No user content, chat, gambling or mature media found. Describe the EMOM guide accurately when asked about health/wellness content. Apple assigns the rating; do not copy a guessed age rating into the listing.

Accessibility declarations: only claim features after testing the final native app against Apple's criteria.

Export compliance: no custom encryption implementation was found in app-owned code. Review the archive/dependencies and answer Apple's actual questions. Do not assume a legal exemption or set an encryption flag from this draft alone.

Sources: [App privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy), [Privacy details](https://developer.apple.com/app-store/app-privacy-details/).
