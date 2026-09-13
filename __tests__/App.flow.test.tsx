import React from 'react';
import TestRenderer, { act, ReactTestInstance } from 'react-test-renderer';

import App from '../App';
import { playFeedback, stopFeedback } from '../src/feedback/workoutFeedback';
jest.mock('../src/feedback/workoutFeedback', () => ({
  prepareFeedback: jest.fn(),
  playFeedback: jest.fn(),
  stopFeedback: jest.fn(),
}));

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
    jest.clearAllMocks();
    jest.useFakeTimers();
    now = 1_000_000;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('requires five taps within two seconds and consumes each tap sequence', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });
    const root = renderer!.root;
    for (let tap = 0; tap < 4; tap++) {
      press(root, 'Minute Work');
    }
    expect(findByLabel(root, '10 minute workout')).toBeTruthy();
    now += 2001;
    press(root, 'Minute Work');
    expect(findByLabel(root, '10 minute workout')).toBeTruthy();
    for (let tap = 0; tap < 4; tap++) {
      now += 500;
      press(root, 'Minute Work');
    }
    expect(findByLabel(root, '2 minute workout')).toBeTruthy();
    expect(
      findByLabel(root, '2 rounds').props.accessibilityState.selected,
    ).toBe(true);
    for (const option of [1, 2, 3, 5]) {
      expect(findByLabel(root, `${option} rounds`)).toBeTruthy();
    }
    for (let tap = 0; tap < 4; tap++) {
      press(root, 'Developer mode');
    }
    expect(findByLabel(root, '2 minute workout')).toBeTruthy();
    press(root, 'Developer mode');
    expect(findByLabel(root, '10 minute workout')).toBeTruthy();
    for (const option of [5, 10, 15, 20]) {
      expect(findByLabel(root, `${option} rounds`)).toBeTruthy();
    }
    act(() => renderer!.unmount());
  });

  it('runs ten-second rounds with cues and stops workouts when changing modes', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });
    const root = renderer!.root;
    const advance = (ms: number) => {
      now += ms;
      act(() => jest.advanceTimersByTime(200));
    };
    const toggle = (label: string) => {
      for (let tap = 0; tap < 5; tap++) {
        press(root, label);
      }
    };
    press(root, 'Start workout  →');
    toggle('Minute Work');
    expect(findByLabel(root, 'Workout setup')).toBeTruthy();
    const calls = jest.mocked(playFeedback).mock.calls.length;
    advance(60_000);
    expect(playFeedback).toHaveBeenCalledTimes(calls);
    press(root, '2 rounds');
    press(root, 'Start workout  →');
    advance(3000);
    expect(findByLabel(root, 'Go!')).toBeTruthy();
    advance(5000);
    expect(findByLabel(root, '5 seconds remaining')).toBeTruthy();
    expect(findByLabel(root, '50% interval complete')).toBeTruthy();
    advance(2000);
    expect(playFeedback).toHaveBeenLastCalledWith('countdown');
    advance(1000);
    advance(1000);
    advance(1000);
    expect(findByLabel(root, 'Round 2 of 2')).toBeTruthy();
    expect(findByLabel(root, '10 seconds remaining')).toBeTruthy();
    expect(playFeedback).toHaveBeenLastCalledWith('start');
    advance(10_000);
    expect(findByLabel(root, 'Workout complete')).toBeTruthy();
    expect(playFeedback).toHaveBeenLastCalledWith('complete');
    press(root, 'Go again');
    press(root, 'Pause');
    toggle('Developer mode');
    expect(findByLabel(root, 'Workout setup')).toBeTruthy();
    expect(findByLabel(root, '10 minute workout')).toBeTruthy();
    const finalCalls = jest.mocked(playFeedback).mock.calls.length;
    advance(60_000);
    expect(playFeedback).toHaveBeenCalledTimes(finalCalls);
    expect(stopFeedback).toHaveBeenCalled();
    press(root, 'Start workout  →');
    advance(4000);
    expect(findByLabel(root, '59 seconds remaining')).toBeTruthy();
    act(() => renderer!.unmount());
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
    expect(findByLabel(root, 'Starting in 3')).toBeTruthy();

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

    now += 33_000;
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

  it('plays the opening countdown, round transitions, and completion exactly once', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });
    const root = renderer!.root;
    const advance = (milliseconds: number) => {
      now += milliseconds;
      act(() => jest.advanceTimersByTime(200));
    };
    press(root, '5 rounds');
    press(root, 'Start workout  →');
    expect(playFeedback).toHaveBeenLastCalledWith('countdown');
    advance(1000);
    expect(findByLabel(root, 'Starting in 2')).toBeTruthy();
    advance(1000);
    expect(findByLabel(root, 'Starting in 1')).toBeTruthy();
    advance(1000);
    expect(findByLabel(root, 'Go!')).toBeTruthy();
    advance(1000);
    expect(findByLabel(root, '59 seconds remaining')).toBeTruthy();
    expect(findByText(root, 'WORK')).toBeTruthy();
    expect(findByText(root, 'until the next minute')).toBeTruthy();
    expect(jest.mocked(playFeedback).mock.calls.map(call => call[0])).toEqual([
      'countdown',
      'countdown',
      'countdown',
      'start',
    ]);
    advance(56_000);
    advance(1000);
    advance(1000);
    advance(1000);
    expect(findByLabel(root, 'Round 2 of 5')).toBeTruthy();
    expect(
      jest
        .mocked(playFeedback)
        .mock.calls.slice(4)
        .map(call => call[0]),
    ).toEqual(['countdown', 'countdown', 'countdown', 'start']);
    advance(200);
    expect(playFeedback).toHaveBeenCalledTimes(8);
    // A delayed tick skips stale countdowns rather than playing a burst.
    advance(239_800);
    expect(findByLabel(root, 'Workout complete')).toBeTruthy();
    expect(playFeedback).toHaveBeenLastCalledWith('complete');
    advance(2000);
    expect(playFeedback).toHaveBeenCalledTimes(9);
    act(() => renderer!.unmount());
  });

  it('pauses the lead-in without repeating cues and cancels feedback on reset', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<App />);
    });
    const root = renderer!.root;
    press(root, 'Start workout  →');
    now += 1400;
    act(() => jest.advanceTimersByTime(200));
    press(root, 'Pause');
    expect(stopFeedback).toHaveBeenCalled();
    now += 10_000;
    act(() => jest.advanceTimersByTime(10_000));
    expect(findByLabel(root, 'Starting in 2')).toBeTruthy();
    press(root, 'Resume');
    expect(playFeedback).toHaveBeenCalledTimes(2);
    now += 600;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Starting in 1')).toBeTruthy();
    press(root, 'Reset');
    now += 10_000;
    act(() => jest.advanceTimersByTime(10_000));
    expect(playFeedback).toHaveBeenCalledTimes(3);
    press(root, 'Start workout  →');
    expect(findByLabel(root, 'Starting in 3')).toBeTruthy();
    expect(playFeedback).toHaveBeenCalledTimes(4);
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
    expect(findByText(root, 'until your first round')).toBeTruthy();

    now += 3000 + 4 * 60_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Round 5 of 5')).toBeTruthy();
    expect(findByText(root, 'until your workout is complete')).toBeTruthy();

    now += 60_000;
    act(() => jest.advanceTimersByTime(200));
    expect(findByLabel(root, 'Workout complete')).toBeTruthy();
    expect(findByLabel(root, 'Round 5 of 5')).toBeTruthy();
    expect(findByLabel(root, '0 seconds remaining')).toBeTruthy();

    press(root, 'Go again');
    expect(findByLabel(root, 'Workout running')).toBeTruthy();
    expect(findByLabel(root, 'Round 1 of 5')).toBeTruthy();
    expect(findByLabel(root, 'Starting in 3')).toBeTruthy();

    act(() => renderer!.unmount());
  });
});
