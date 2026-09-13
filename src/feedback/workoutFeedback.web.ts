/// <reference lib="dom" />
import type { WorkoutCue } from './workoutFeedback';

let context: AudioContext | undefined;
const active = new Set<OscillatorNode>();
let generation = 0;

export function prepareFeedback() {
  const Audio = globalThis.AudioContext;
  if (!Audio) {
    return;
  }
  context ??= new Audio();
  context.resume().catch(() => {});
}

export function stopFeedback() {
  generation += 1;
  active.forEach(oscillator => oscillator.stop());
  active.clear();
  globalThis.navigator?.vibrate?.(0);
}

export function playFeedback(cue: WorkoutCue) {
  stopFeedback();
  const token = generation;
  const audio = context;
  const notes =
    cue === 'complete'
      ? [523.25, 659.25, 783.99, 1046.5]
      : [cue === 'start' ? 880 : 660];
  const duration = cue === 'countdown' ? 0.1 : cue === 'start' ? 0.6 : 0.16;
  const play = () => {
    if (token !== generation) {
      return;
    }
    globalThis.navigator?.vibrate?.(
      cue === 'countdown'
        ? 40
        : cue === 'start'
        ? 300
        : [80, 100, 80, 100, 80, 100, 200],
    );
    if (!audio) {
      return;
    }
    notes.forEach((frequency, index) => {
      const start = audio.currentTime + index * 0.18;
      const length = cue === 'complete' && index === 3 ? 0.36 : duration;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.008);
      gain.gain.setValueAtTime(0.2, start + length - 0.02);
      gain.gain.linearRampToValueAtTime(0, start + length);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      active.add(oscillator);
      oscillator.onended = () => {
        active.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(start + length);
    });
  };
  if (audio?.state === 'suspended') {
    audio
      .resume()
      .then(play)
      .catch(() => {});
  } else {
    play();
  }
}
