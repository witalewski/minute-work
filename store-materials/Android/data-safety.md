# Google Play app-content answers — draft

Based on application source and direct dependencies inspected on 15 September 2026. Verify the final merged manifest, release bundle, SDK behavior and production network activity before submitting.

| Question | Proposed answer / action |
| --- | --- |
| Does the app collect or share required user data types? | No, based on current app source. Confirm final release and SDKs. |
| Advertising | No ads found. |
| Advertising ID | No advertising SDK or AD_ID permission found in app source manifest; confirm merged manifest. |
| Account creation | No account creation or login. |
| Account deletion | No app account exists. Answer only applicable fields; do not invent a deletion URL. |
| App access | All functionality available without credentials. |
| Health apps declaration | Activity and fitness is the relevant proposed category for an exercise timer. Do not claim medical functionality or Health Connect access. |
| Health data | Timer does not measure, save or transmit health metrics. |
| Permissions | INTERNET and VIBRATE declared in source. Audio cues do not require microphone recording. |
| Target audience | Publisher must select intended ages. Not presented as a children's app; do not infer target audience from content rating. |
| Content rating | Complete IARC questionnaire truthfully; no violence, gambling, sexual content, user posts or chat found. Rating is assigned by Google. |
| Privacy policy | Complete and host shared draft; place URL in listing and accessible in app. |

Support email is a separate, voluntary contact channel; review its handling against the form's definitions. Do not select security certifications or encryption claims merely because the app has no backend. Answer additional conditional questions only when displayed.

Sources: [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469), [Health declaration](https://support.google.com/googleplay/android-developer/answer/14738291).
