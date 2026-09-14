/// <reference lib="dom" />

export function keepScreenAwake(): () => void {
  const document = globalThis.document;
  const wakeLock = globalThis.navigator?.wakeLock;
  if (!document || !wakeLock) {
    return () => {};
  }

  let disposed = false;
  let pending = false;
  let lock: WakeLockSentinel | undefined;
  const release = (sentinel: WakeLockSentinel) => {
    sentinel.release().catch(() => {});
  };
  const acquire = async () => {
    if (disposed || pending || lock || document.visibilityState !== 'visible') {
      return;
    }
    pending = true;
    try {
      const sentinel = await wakeLock.request('screen');
      // A request may resolve after the timer stops or the tab is hidden.
      if (disposed || document.visibilityState !== 'visible') {
        release(sentinel);
        return;
      }
      lock = sentinel;
      sentinel.addEventListener(
        'release',
        () => {
          if (lock === sentinel) {
            lock = undefined;
          }
        },
        { once: true },
      );
    } catch {
      // Unsupported contexts, permissions, or power-saving policies must not
      // prevent the workout from running.
    } finally {
      pending = false;
    }
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      acquire();
    } else if (lock) {
      const sentinel = lock;
      lock = undefined;
      release(sentinel);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  acquire();

  return () => {
    disposed = true;
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (lock) {
      release(lock);
      lock = undefined;
    }
  };
}
