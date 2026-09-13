import { NativeModules } from 'react-native';

export type WorkoutCue = 'countdown' | 'start' | 'complete';

const feedback = NativeModules.WorkoutFeedback as {
  prepare: () => void;
  play: (cue: WorkoutCue) => void;
  stop: () => void;
};

export const prepareFeedback = () => feedback?.prepare();
export const playFeedback = (cue: WorkoutCue) => feedback?.play(cue);
export const stopFeedback = () => feedback?.stop();
