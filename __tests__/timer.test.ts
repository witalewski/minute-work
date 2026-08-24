import { formatTime, getTimerSnapshot } from '../src/domain/timer';

describe('formatTime', () => {
  it.each([
    [60, '01:00'],
    [9, '00:09'],
    [125, '02:05'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });

  it('normalizes negative and fractional input', () => {
    expect(formatTime(-1)).toBe('00:00');
    expect(formatTime(9.9)).toBe('00:09');
  });
});

describe('getTimerSnapshot', () => {
  it('returns the initial interval', () => {
    expect(getTimerSnapshot(0, 5)).toEqual({
      currentRound: 1,
      secondsLeft: 60,
      complete: false,
    });
  });

  it('moves to the next round exactly on the boundary', () => {
    expect(getTimerSnapshot(60_000, 5)).toEqual({
      currentRound: 2,
      secondsLeft: 60,
      complete: false,
    });
  });

  it('keeps sub-second time in the current displayed second', () => {
    expect(getTimerSnapshot(59_999, 5)).toEqual({
      currentRound: 1,
      secondsLeft: 1,
      complete: false,
    });
  });

  it('marks the workout complete at its total duration', () => {
    expect(getTimerSnapshot(300_000, 5)).toEqual({
      currentRound: 5,
      secondsLeft: 0,
      complete: true,
    });
  });
});
