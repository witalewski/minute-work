import React from 'react';
import TestRenderer, { act, ReactTestInstance } from 'react-test-renderer';

import App from '../App';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function findByLabel(
  root: ReactTestInstance,
  label: string,
): ReactTestInstance {
  return root.find(node => node.props.accessibilityLabel === label);
}

function findByText(root: ReactTestInstance, text: string): ReactTestInstance {
  return root.find(node => node.props.children === text);
}

function press(root: ReactTestInstance, label: string) {
  const target = root.find(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  );
  act(() => target.props.onPress());
}

describe('workout flow', () => {
  let now: number;

  beforeEach(() => {
    jest.useFakeTimers();
    now = 1_000_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('selects a workout length, starts it, and resets to setup', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });

    const root = renderer!.root;
    expect(findByLabel(root, '10 minute workout')).toBeTruthy();

    press(root, '5 rounds');
    expect(findByLabel(root, '5 minute workout')).toBeTruthy();

    press(root, 'Start workout  →');
    expect(findByLabel(root, 'Workout running')).toBeTruthy();
    expect(findByLabel(root, 'Round 1 of 5')).toBeTruthy();
    expect(findByLabel(root, '60 seconds remaining')).toBeTruthy();

    press(root, 'Reset');
    expect(findByLabel(root, 'Workout setup')).toBeTruthy();
    expect(findByLabel(root, '5 minute workout')).toBeTruthy();

    act(() => renderer!.unmount());
  });

  it('preserves elapsed time while paused and resumes from that point', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });

    const root = renderer!.root;
    press(root, 'Start workout  →');

    now += 30_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, '30 seconds remaining')).toBeTruthy();

    press(root, 'Pause');
    now += 45_000;
    act(() => jest.advanceTimersByTime(45_000));
    expect(findByLabel(root, 'Workout paused')).toBeTruthy();
    expect(findByLabel(root, '30 seconds remaining')).toBeTruthy();

    press(root, 'Resume');
    now += 30_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Workout running')).toBeTruthy();
    expect(findByLabel(root, 'Round 2 of 10')).toBeTruthy();
    expect(findByLabel(root, '60 seconds remaining')).toBeTruthy();

    act(() => renderer!.unmount());
  });

  it('shows completion and can start the same workout again', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });

    const root = renderer!.root;
    press(root, '5 rounds');
    press(root, 'Start workout  →');
    expect(findByText(root, 'until the next minute')).toBeTruthy();

    now += 4 * 60_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Round 5 of 5')).toBeTruthy();
    expect(
      findByText(root, 'until your workout is complete'),
    ).toBeTruthy();

    now += 60_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Workout complete')).toBeTruthy();
    expect(findByLabel(root, 'Round 5 of 5')).toBeTruthy();
    expect(findByLabel(root, '0 seconds remaining')).toBeTruthy();

    press(root, 'Go again');
    expect(findByLabel(root, 'Workout running')).toBeTruthy();
    expect(findByLabel(root, 'Round 1 of 5')).toBeTruthy();
    expect(findByLabel(root, '60 seconds remaining')).toBeTruthy();

    act(() => renderer!.unmount());
  });
});
