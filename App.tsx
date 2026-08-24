import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { AppFooter } from './src/components/AppFooter';
import { AppHeader } from './src/components/AppHeader';
import { useEmomTimer } from './src/hooks/useEmomTimer';
import { WorkoutSetup } from './src/screens/WorkoutSetup';
import { WorkoutTimer } from './src/screens/WorkoutTimer';

export default function App() {
  const { height, width } = useWindowDimensions();
  const compact = width < 520;
  const short = height < 750;
  const timer = useEmomTimer();

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4ED" />
      <View style={[styles.shell, compact && styles.shellCompact]}>
        <AppHeader />

        {timer.status === 'setup' ? (
          <WorkoutSetup
            compact={compact}
            rounds={timer.rounds}
            onRoundsChange={timer.setRounds}
            onStart={timer.start}
          />
        ) : (
          <WorkoutTimer
            compact={compact}
            short={short}
            rounds={timer.rounds}
            status={timer.status}
            currentRound={timer.currentRound}
            secondsLeft={timer.secondsLeft}
            roundProgress={timer.roundProgress}
            start={timer.start}
            pause={timer.pause}
            resume={timer.resume}
            reset={timer.reset}
          />
        )}

        <AppFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#F7F4ED',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingTop: Platform.OS === 'ios' ? 58 : 32,
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  shellCompact: {
    paddingTop: Platform.OS === 'ios' ? 52 : 22,
    paddingHorizontal: 20,
  },
});
