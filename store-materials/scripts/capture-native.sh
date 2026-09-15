#!/usr/bin/env bash
set -euo pipefail
# Navigate the FINAL native app to the desired screen before each capture.
# Usage from project root:
# bash store-materials/scripts/capture-native.sh Android 01-setup DEVICE_SERIAL
# bash store-materials/scripts/capture-native.sh iOS 01-setup BOOTED_SIMULATOR_UDID
# Android requires adb on PATH (or set ADB to its full path).
# iOS requires an accepted Xcode license and a booted simulator.
platform="${1:?Supply Android or iOS}"
shot="${2:?Supply a screenshot name, e.g. 01-setup}"
device="${3:?Supply an explicit device serial or simulator UDID}"
case "$shot" in *[!a-zA-Z0-9_-]*|'') echo 'Use letters, numbers, underscores or hyphens for the shot name.' >&2; exit 1;; esac
case "$platform" in Android|iOS) ;; *) echo 'Platform must be Android or iOS.' >&2; exit 1;; esac
materials="$(cd "$(dirname "$0")/.." && pwd)"
destination="$materials/$platform/screenshots/native/$shot.png"
mkdir -p "$(dirname "$destination")"
if [ -e "$destination" ]; then echo "Already exists: $destination. Choose a new shot name." >&2; exit 1; fi
temporary="$(mktemp "$(dirname "$destination")/.capture-XXXXXX")"
trap 'rm -f "$temporary"' EXIT
if [ "$platform" = Android ]; then
  "${ADB:-adb}" -s "$device" exec-out screencap -p > "$temporary"
else
  xcrun simctl io "$device" screenshot --type=png "$temporary"
fi
test -s "$temporary"
mv "$temporary" "$destination"
echo "Captured: $destination"
echo 'Check native appearance, dimensions, transparency and store requirements before uploading.'
