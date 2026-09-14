# Minute Work brand assets

All artwork is checked in as static PNG files. No image generation or Swift
script is required to build or run the app.

| Asset | Use |
| --- | --- |
| `minute-work-icon.png` | Opaque 1254 × 1254 master: coral background and timer logo. Suitable for app listings and general brand imagery. |
| `minute-work-icon-foreground.png` | Transparent 1254 × 1254 timer logo with adaptive-icon padding. Use on a coral background; its off-white details need sufficient contrast. |
| `../../ios/EmomTimer/Images.xcassets/AppIcon.appiconset/` | Ready-to-use iPhone icons at 40–180 px and the opaque 1024 px App Store icon. |
| `../../android/app/src/main/res/mipmap-*/` | Launcher icons at 48–192 px and transparent adaptive foregrounds at 108–432 px. Adaptive XML resources combine the foreground with the coral background. |
| `../../web/icons/` | 32 px favicon, 180 px Apple touch icon, and 192/512 px web app icons. |

The full display name is **Minute Work - EMOM Timer**. The web manifest also
provides **Minute Work** as the short name for compact launcher labels.

The master was created with the built-in ImageGen tool using this design brief:
“A bold, minimal timer/progress-ring mark for an EMOM workout app, centered on
a full-bleed coral #FF5538 square, with warm near-black #20201E and off-white
#F7F4ED details, no text, legible at favicon sizes.” Platform PNGs are static
exports of that artwork.
