import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { View } from 'uniwind/components';

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
    <View className="min-h-full flex-1 bg-[#F7F4ED]">
      <StatusBar barStyle="dark-content" backgroundColor="#F7F4ED" />
      <View
        className={`w-full max-w-[980px] flex-1 self-center pb-6 ${
          compact
            ? 'px-5 pt-[22px] ios:pt-[52px]'
            : 'px-10 pt-8 ios:pt-[58px]'
        }`}
      >
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
