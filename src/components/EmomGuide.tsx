import React from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import { Pressable, Text, View } from 'uniwind/components';

const body = 'text-base leading-[25px] text-[#65625D] dark:text-[#BDB8AE]';
const heading = 'text-xl font-[800] text-[#20201E] dark:text-[#F2EFE8]';

export function EmomGuide({ onClose }: { onClose: () => void }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/60 px-3 py-6 ios:pt-[58px] ios:pb-[34px]">
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          className="w-full max-w-[620px] flex-1 self-center overflow-hidden rounded-3xl bg-[#F7F4ED] dark:bg-[#171512]"
          style={styles.panel}
        >
          <View className="flex-row items-center gap-3 border-b border-[#D8D3C8] px-5 py-3 dark:border-[#3A3733]">
            <Text accessibilityRole="header" className={`flex-1 ${heading}`}>
              A minute to understand EMOM
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close EMOM guide"
              onPress={onClose}
              className="min-h-11 min-w-11 items-center justify-center rounded-full border border-[#BDB8AE] px-3 dark:border-[#4A463F]"
            >
              <Text className="text-base font-bold text-[#20201E] dark:text-[#F2EFE8]">
                Close
              </Text>
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
          >
            <View className="mb-6 rounded-2xl border border-[#C8B79B] bg-[#EEE6D7] p-4 dark:border-[#655640] dark:bg-[#30291F]">
              <Text accessibilityRole="header" className={heading}>
                Start with a personal trainer
              </Text>
              <Text className={`mt-2 ${body}`}>
                The best way to start is with a qualified personal trainer who
                can prescribe a plan and teach you how to perform it. Every plan
                should suit your individual capabilities, preferences, health,
                and experience. Ask a healthcare professional about any health
                concerns before you begin.
              </Text>
              <Text className={`mt-3 font-bold ${body}`}>
                Minute Work is only a timing tool for exercise prescribed by a
                qualified professional. It does not provide medical advice,
                training advice, or a personalised exercise plan.
              </Text>
            </View>

            <Text accessibilityRole="header" className={heading}>
              What does EMOM mean?
            </Text>
            <Text className={`mt-2 ${body}`}>
              EMOM means “Every Minute On the Minute”. At the start of each
              minute, you begin the exercise and repetitions in your plan. When
              you finish, rest for the remainder of that minute. The next minute
              starts a new round.
            </Text>
            <View className="my-5 items-center rounded-2xl bg-[#20201E] p-5">
              <View
                accessible
                accessibilityLabel="Each round lasts 60 seconds"
                className="h-28 w-28 items-center justify-center rounded-full border-[6px] border-[#FF5538]"
              >
                <Text className="text-2xl font-black text-white">60</Text>
                <Text className="text-sm text-white">seconds</Text>
              </View>
              <Text className="mt-4 text-center text-base font-bold text-white">
                Begin → Finish your reps → Rest
              </Text>
              <Text className="mt-2 text-center text-sm text-[#D8D3C8]">
                Repeat when the next minute begins.
              </Text>
            </View>

            <Text accessibilityRole="header" className={heading}>
              Example: 20 sit-ups, for 5 minutes
            </Text>
            <Text className={`mt-2 ${body}`}>
              This is a timing example, not a workout recommendation. Only use
              it if your trainer has prescribed it as appropriate for you.
            </Text>
            <Text className={`mt-3 ${body}`}>
              1. Select 5 rounds on the setup screen. Check that each round is
              60 seconds.
            </Text>
            <Text className={`mt-3 ${body}`}>
              2. Tap “Start workout”. After the 3-second countdown, “Go!” marks
              the start of your first minute. Begin your 20 sit-ups as taught by
              your trainer, then rest for the time left in that minute.
            </Text>
            <Text className={`mt-3 ${body}`}>
              3. At each new round, repeat the prescribed 20 sit-ups and rest
              for the remaining time. After round 5, the app shows “Workout
              complete”. The five minutes exclude the opening countdown.
            </Text>
            <View className="my-5 rounded-2xl border border-[#D8D3C8] p-4 dark:border-[#3A3733]">
              <Text
                accessibilityRole="header"
                className="mb-3 text-base font-bold text-[#20201E] dark:text-[#F2EFE8]"
              >
                Your five-minute timeline - example
              </Text>
              {[20, 27, 28, 52, 60].map((workSeconds, minute) => (
                <View key={minute} className="mb-4">
                  <Text
                    className={`mb-1 font-bold ${body}`}
                  >{`${minute}:00 · Round ${minute + 1}`}</Text>
                  <View
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    className="mb-1 h-3 flex-row overflow-hidden rounded-full"
                  >
                    <View
                      className="bg-[#FF5538]"
                      style={{ width: `${(workSeconds / 60) * 100}%` }}
                    />
                    <View className="flex-1 bg-[#BDB8AE] dark:bg-[#655F55]" />
                  </View>
                  <Text className={body}>
                    {workSeconds === 60
                      ? '20 sit-ups · full minute, no rest left'
                      : `20 sit-ups · ${workSeconds}s work → ${
                          60 - workSeconds
                        }s rest`}
                  </Text>
                </View>
              ))}
              <Text className={`font-bold ${body}`}>
                5:00 · Workout complete
              </Text>
              <Text className={`mt-3 ${body}`}>
                Orange = repetitions. Grey = remaining rest. This example shows
                later rounds taking longer, with no rest left in the final
                round. These are illustrative times, not targets; your pace
                determines the split.
              </Text>
            </View>

            <Text accessibilityRole="header" className={heading}>
              You stay in control
            </Text>
            <Text className={`mt-2 ${body}`}>
              The timer tracks minutes, not repetitions or technique. It keeps
              counting while you rest, even when the screen says “WORK”. Follow
              your professional’s plan; don’t rush or force repetitions to beat
              the clock. If the plan doesn’t fit comfortably into a minute, ask
              your trainer to adapt it.
            </Text>
            <Text className={`mt-3 ${body}`}>
              Tap “Pause” to stop the clock, “Resume” to continue, or “Reset” to
              end the session and return to setup. Opening this guide does not
              pause a running timer.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  panel: { maxHeight: '100%' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
});
