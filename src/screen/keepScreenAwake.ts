import { NativeModules } from 'react-native';

// The existing iOS bridge also owns the application's idle timer setting.
export function keepScreenAwake(): () => void {
  const feedback = NativeModules.WorkoutFeedback as
    | { setScreenAwake: (awake: boolean) => void }
    | undefined;
  feedback?.setScreenAwake(true);
  return () => feedback?.setScreenAwake(false);
}
