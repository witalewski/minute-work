import {formatTime} from '../App';

describe('formatTime', () => {
  it('formats a full EMOM interval', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('pads the remaining seconds', () => {
    expect(formatTime(9)).toBe('00:09');
  });
});
