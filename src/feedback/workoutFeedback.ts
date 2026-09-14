import { NativeModules, Platform, Vibration } from 'react-native';

export type WorkoutCue = 'countdown' | 'start' | 'complete';

const feedback = () =>
  NativeModules.WorkoutFeedback as
    | {
        prepare: () => void;
        play: (cue: WorkoutCue) => void;
        stop: () => void;
        playVibration?: (cue: WorkoutCue) => void;
        stopVibration?: () => void;
      }
    | undefined;

export const prepareFeedback = () => feedback()?.prepare();
export const playFeedback = (cue: WorkoutCue) => {
  feedback()?.play(cue);
  if (Platform.OS === 'android') {
    // Older installed binaries may lack these methods. Never fall back to the
    // unguarded RN vibrator: native SecurityExceptions cannot be caught in JS.
    feedback()?.playVibration?.(cue);
  } else {
    Vibration.cancel();
    // iOS arrays contain delays between fixed-length pulses.
    Vibration.vibrate(cue === 'complete' ? [0, 650] : 400, false);
  }
};
export const stopFeedback = () => {
  feedback()?.stop();
  if (Platform.OS === 'android') {
    feedback()?.stopVibration?.();
  } else {
    Vibration.cancel();
  }
};
