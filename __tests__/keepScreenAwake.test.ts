import { NativeModules } from 'react-native';
import { keepScreenAwake } from '../src/screen/keepScreenAwake';
import { keepScreenAwake as keepWebScreenAwake } from '../src/screen/keepScreenAwake.web';

describe('screen wake lock', () => {
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document',
  );
  const originalNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    'navigator',
  );
  const originalFeedback = NativeModules.WorkoutFeedback;
  let visibilityState: string;
  let listeners: Set<() => void>;
  let request: jest.Mock;
  const sentinel = () => ({
    release: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
  });
  const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };
  const visibility = async (state: string) => {
    visibilityState = state;
    listeners.forEach(listener => listener());
    await flush();
  };

  beforeEach(() => {
    visibilityState = 'visible';
    listeners = new Set();
    request = jest.fn();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        get visibilityState() {
          return visibilityState;
        },
        addEventListener: (_: string, listener: () => void) =>
          listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) =>
          listeners.delete(listener),
      },
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { wakeLock: { request } },
    });
  });

  afterEach(() => {
    for (const [key, descriptor] of [
      ['document', originalDocument],
      ['navigator', originalNavigator],
    ] as const) {
      if (descriptor) {
        Object.defineProperty(globalThis, key, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, key);
      }
    }
    NativeModules.WorkoutFeedback = originalFeedback;
  });

  it('acquires and releases the native idle timer through the bridge', () => {
    const setScreenAwake = jest.fn();
    NativeModules.WorkoutFeedback = { setScreenAwake };
    const stop = keepScreenAwake();
    expect(setScreenAwake.mock.calls).toEqual([[true]]);
    stop();
    expect(setScreenAwake.mock.calls).toEqual([[true], [false]]);
  });

  it('releases the browser lock and removes visibility listeners on cleanup', async () => {
    const lock = sentinel();
    request.mockResolvedValue(lock);
    const stop = keepWebScreenAwake();
    await flush();
    expect(request).toHaveBeenCalledWith('screen');
    stop();
    expect(lock.release).toHaveBeenCalledTimes(1);
    expect(listeners.size).toBe(0);
    await visibility('visible');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('releases a pending request after cleanup without disturbing a new workout', async () => {
    const oldLock = sentinel();
    const newLock = sentinel();
    let resolve!: (value: ReturnType<typeof sentinel>) => void;
    request
      .mockReturnValueOnce(
        new Promise(done => {
          resolve = done;
        }),
      )
      .mockResolvedValueOnce(newLock);
    const stop = keepWebScreenAwake();
    stop();
    const stopNew = keepWebScreenAwake();
    resolve(oldLock);
    await flush();
    expect(oldLock.release).toHaveBeenCalledTimes(1);
    expect(newLock.release).not.toHaveBeenCalled();
    stopNew();
    expect(newLock.release).toHaveBeenCalledTimes(1);
  });

  it('reacquires when visible and avoids duplicate requests', async () => {
    const first = sentinel();
    const second = sentinel();
    request.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const stop = keepWebScreenAwake();
    await visibility('visible');
    expect(request).toHaveBeenCalledTimes(1);
    await visibility('hidden');
    expect(first.release).toHaveBeenCalledTimes(1);
    await visibility('visible');
    expect(request).toHaveBeenCalledTimes(2);
    stop();
    expect(second.release).toHaveBeenCalledTimes(1);
  });

  it('reacquires an automatically released lock on returning to the tab', async () => {
    const first = sentinel();
    request.mockResolvedValueOnce(first).mockResolvedValueOnce(sentinel());
    const stop = keepWebScreenAwake();
    await flush();
    first.addEventListener.mock.calls[0][1]();
    await visibility('visible');
    expect(request).toHaveBeenCalledTimes(2);
    stop();
  });

  it('defers acquisition while hidden and releases requests resolved while hidden', async () => {
    visibilityState = 'hidden';
    let resolve!: (value: ReturnType<typeof sentinel>) => void;
    request.mockReturnValue(
      new Promise(done => {
        resolve = done;
      }),
    );
    const stop = keepWebScreenAwake();
    expect(request).not.toHaveBeenCalled();
    await visibility('visible');
    await visibility('hidden');
    const lock = sentinel();
    resolve(lock);
    await flush();
    expect(lock.release).toHaveBeenCalledTimes(1);
    stop();
  });

  it('tolerates denied requests and retries on the next visible transition', async () => {
    request
      .mockRejectedValueOnce(new Error('Denied'))
      .mockResolvedValueOnce(sentinel());
    const stop = keepWebScreenAwake();
    await flush();
    await visibility('visible');
    expect(request).toHaveBeenCalledTimes(2);
    stop();
  });

  it('tolerates unavailable APIs and rejected releases', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {},
    });
    keepWebScreenAwake()();
    expect(request).not.toHaveBeenCalled();
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { wakeLock: { request } },
    });
    const lock = sentinel();
    lock.release.mockRejectedValue(new Error('Release failed'));
    request.mockResolvedValue(lock);
    const stop = keepWebScreenAwake();
    await flush();
    stop();
    await flush();
  });
});
