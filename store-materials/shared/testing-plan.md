# Store testing and feedback plan

Use the final native release candidate on a physical device. Web captures do not validate native audio, vibration, background behavior or signing.

- [ ] Fresh install, first launch and operation without a development server.
- [ ] Select each normal round count: 5, 10, 15, 20. Each is 60 seconds.
- [ ] Opening countdown, first-round start, boundary cues, final completion.
- [ ] Pause during opening countdown and mid-round; resume without time jumps.
- [ ] Reset while running/paused; Go again after completion.
- [ ] Full five-minute normal session (do not rely only on developer mode).
- [ ] Audio, vibration and external audio route behavior on real hardware.
- [ ] Screen stays awake during active workout; normal idle behavior returns afterward.
- [ ] Background/foreground, manual lock/unlock and interruption recovery. Do not advertise background timing unless separately implemented and verified.
- [ ] Light/dark mode; small and large supported phones; supported rotations.
- [ ] Guide opens, scrolls and closes; timer behavior while guide is open.
- [ ] VoiceOver/TalkBack and larger text: record results before declaring accessibility support.
- [ ] No sign-in, ads, purchases, unexpected requests or release debug UI.
- [ ] Privacy link and public support/privacy pages work on both platforms.

Record device, OS, build, scenario, result, issue and resolution in `tester-feedback.csv`. No results have been prefilled or invented.
