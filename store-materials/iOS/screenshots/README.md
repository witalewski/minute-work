# iOS screenshot kit

## Current status

`preview-only/` contains five branded 1320 × 2868 PNG layouts and their raw React Native Web captures. They are design previews, not native store-upload screenshots. No native captures were possible in this environment. Capture the final native build and use raw native screenshots directly or place them into the approved composition without cropping UI or distorting proportions.

## Capture sequence

1. Light setup: select 5 rounds; show the complete setup screen.
2. Light running: start, wait through the opening countdown, capture around 00:45 remaining in round 1.
3. Light paused: tap Pause; show Resume and Reset.
4. Dark running: change device appearance, resume and capture.
5. Light completion: complete all five normal rounds; show Go again and Reset.

Keep developer mode off. Do not simulate unsupported features or edit timer text in the capture. Use a clean device with no personal notifications or development overlays. Review every image for clipping, readable text and the actual release appearance.

Use `../../scripts/capture-native.sh` from the project root as described in that script. It captures the currently visible native screen; navigate the app first. Store real captures under a separate `native/` folder.

## Apple specifications

The prepared composition size 1320 × 2868 is listed for the 6.9-inch iPhone screenshot slot. Apple also lists 1260 × 2736 and 1290 × 2796 for that slot. Use an accepted native device size; do not stretch a smaller capture to pretend it came from a different device. Upload 1–10 screenshots for the relevant device group. If iPad is supported, prepare its required screenshot group too; this kit does not include iPad previews.

Source: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications
