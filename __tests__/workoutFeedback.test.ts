import { NativeModules, Platform, Vibration } from 'react-native';
import {
  playFeedback,
  prepareFeedback,
  stopFeedback,
} from '../src/feedback/workoutFeedback';

describe('native workout feedback', () => {
  const originalFeedback = NativeModules.WorkoutFeedback;
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    NativeModules.WorkoutFeedback = {
      prepare: jest.fn(),
      play: jest.fn(),
      stop: jest.fn(),
      playVibration: jest.fn(),
      stopVibration: jest.fn(),
    };
    jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});
    jest.spyOn(Vibration, 'cancel').mockImplementation(() => {});
  });

  afterEach(() => {
    NativeModules.WorkoutFeedback = originalFeedback;
    Platform.OS = originalPlatform;
    jest.restoreAllMocks();
  });

  it.each(['ios', 'android'] as const)(
    'plays all sounds through the %s bridge',
    os => {
      Platform.OS = os;
      prepareFeedback();
      for (const cue of ['countdown', 'start', 'complete'] as const)
        playFeedback(cue);
      expect(NativeModules.WorkoutFeedback.prepare).toHaveBeenCalledTimes(1);
      expect(NativeModules.WorkoutFeedback.play.mock.calls).toEqual([
        ['countdown'],
        ['start'],
        ['complete'],
      ]);
      stopFeedback();
      expect(NativeModules.WorkoutFeedback.stop).toHaveBeenCalledTimes(1);
      if (os === 'ios') {
        expect(Vibration.cancel).toHaveBeenCalledTimes(4);
      } else {
        expect(Vibration.cancel).not.toHaveBeenCalled();
        expect(
          NativeModules.WorkoutFeedback.stopVibration,
        ).toHaveBeenCalledTimes(1);
      }
    },
  );

  it('routes Android vibration through the permission-guarded native bridge', () => {
    Platform.OS = 'android';
    playFeedback('countdown');
    playFeedback('start');
    playFeedback('complete');
    expect(NativeModules.WorkoutFeedback.playVibration.mock.calls).toEqual([
      ['countdown'],
      ['start'],
      ['complete'],
    ]);
    expect(Vibration.vibrate).not.toHaveBeenCalled();
    expect(Vibration.cancel).not.toHaveBeenCalled();
  });

  it('keeps sound and workout controls working with older Android binaries', () => {
    Platform.OS = 'android';
    delete NativeModules.WorkoutFeedback.playVibration;
    delete NativeModules.WorkoutFeedback.stopVibration;
    prepareFeedback();
    playFeedback('countdown');
    stopFeedback();
    expect(NativeModules.WorkoutFeedback.play).toHaveBeenCalledWith(
      'countdown',
    );
    expect(NativeModules.WorkoutFeedback.stop).toHaveBeenCalledTimes(1);
    expect(Vibration.vibrate).not.toHaveBeenCalled();
    expect(Vibration.cancel).not.toHaveBeenCalled();
  });

  it('skips feedback safely on Android when the native module is missing', () => {
    Platform.OS = 'android';
    NativeModules.WorkoutFeedback = undefined;
    prepareFeedback();
    playFeedback('countdown');
    stopFeedback();
    expect(Vibration.vibrate).not.toHaveBeenCalled();
    expect(Vibration.cancel).not.toHaveBeenCalled();
  });

  it('uses iOS fixed pulses and delay-only completion pattern', () => {
    Platform.OS = 'ios';
    playFeedback('countdown');
    playFeedback('start');
    playFeedback('complete');
    expect(Vibration.vibrate).toHaveBeenNthCalledWith(1, 400, false);
    expect(Vibration.vibrate).toHaveBeenNthCalledWith(2, 400, false);
    expect(Vibration.vibrate).toHaveBeenNthCalledWith(3, [0, 650], false);
  });

  it('still vibrates on iOS when the sound bridge is unavailable', () => {
    Platform.OS = 'ios';
    NativeModules.WorkoutFeedback = undefined;
    prepareFeedback();
    playFeedback('countdown');
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    stopFeedback();
    expect(Vibration.cancel).toHaveBeenCalledTimes(2);
  });
});
