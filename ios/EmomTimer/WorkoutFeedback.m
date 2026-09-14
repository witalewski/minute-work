#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import <math.h>

@interface WorkoutFeedback : NSObject <RCTBridgeModule>
@property(nonatomic, strong) AVAudioPlayer *player;
@property(nonatomic, strong) UIImpactFeedbackGenerator *light;
@property(nonatomic, strong) UIImpactFeedbackGenerator *strong;
@property(nonatomic, strong) NSMutableDictionary<NSString *, NSData *> *sounds;
@property(nonatomic, assign) NSUInteger generation;
@property(nonatomic, assign) BOOL workoutActive;
@property(nonatomic, assign) BOOL previousIdleTimerDisabled;
@end

@implementation WorkoutFeedback
RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup { return YES; }
- (dispatch_queue_t)methodQueue { return dispatch_get_main_queue(); }

// Generate PCM tones in memory, with a short envelope to avoid clicks.
- (NSData *)soundForCue:(NSString *)cue {
  BOOL complete = [cue isEqualToString:@"complete"];
  BOOL start = [cue isEqualToString:@"start"];
  const double rate = 44100;
  double duration = complete ? 0.76 : start ? 0.6 : 0.1;
  uint32_t sampleCount = (uint32_t)(rate * duration);
  uint32_t dataSize = sampleCount * 2;
  uint32_t riffSize = dataSize + 36, formatSize = 16, sampleRate = 44100, byteRate = 88200;
  uint16_t pcm = 1, channels = 1, alignment = 2, bits = 16;
  NSMutableData *data = [NSMutableData data];
  [data appendBytes:"RIFF" length:4];
  [data appendBytes:&riffSize length:4];
  [data appendBytes:"WAVEfmt " length:8];
  [data appendBytes:&formatSize length:4];
  [data appendBytes:&pcm length:2];
  [data appendBytes:&channels length:2];
  [data appendBytes:&sampleRate length:4];
  [data appendBytes:&byteRate length:4];
  [data appendBytes:&alignment length:2];
  [data appendBytes:&bits length:2];
  [data appendBytes:"data" length:4];
  [data appendBytes:&dataSize length:4];
  double notes[] = {523.25, 783.99};
  for (uint32_t i = 0; i < sampleCount; i++) {
    double time = i / rate;
    int note = complete ? MIN(1, (int)(time / 0.26)) : 0;
    double local = complete ? time - note * 0.26 : time;
    double length = complete ? (note == 1 ? 0.5 : 0.2) : duration;
    double envelope = MAX(0, MIN(1, MIN(local / 0.008, (length - local) / 0.02)));
    double frequency = complete ? notes[note] : start ? 880 : 660;
    int16_t sample = (int16_t)(sin(2 * M_PI * frequency * local) * envelope * 8000);
    [data appendBytes:&sample length:2];
  }
  return data;
}

RCT_EXPORT_METHOD(prepare) {
  if (!self.light) {
    self.light = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleLight];
    self.strong = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleHeavy];
    self.sounds = [NSMutableDictionary dictionary];
    for (NSString *cue in @[@"countdown", @"start", @"complete"]) {
      self.sounds[cue] = [self soundForCue:cue];
    }
  }
  AVAudioSession *session = AVAudioSession.sharedInstance;
  [session setCategory:AVAudioSessionCategoryPlayback
          withOptions:AVAudioSessionCategoryOptionMixWithOthers error:nil];
  [session setActive:YES error:nil];
  [self.light prepare];
  [self.strong prepare];
}

RCT_EXPORT_METHOD(setScreenAwake:(BOOL)awake) {
  if (awake) {
    if (!self.workoutActive) {
      self.previousIdleTimerDisabled = UIApplication.sharedApplication.idleTimerDisabled;
      self.workoutActive = YES;
      UIApplication.sharedApplication.idleTimerDisabled = YES;
    }
  } else {
    [self restoreIdleTimer];
  }
}

- (void)restoreIdleTimer {
  if (self.workoutActive) {
    UIApplication.sharedApplication.idleTimerDisabled = self.previousIdleTimerDisabled;
    self.workoutActive = NO;
  }
}

RCT_EXPORT_METHOD(stop) {
  [self cancelPlayback];
}

- (void)cancelPlayback {
  self.generation += 1;
  [self.player stop];
  self.player = nil;
}

RCT_EXPORT_METHOD(play:(NSString *)cue) {
  [self cancelPlayback];
  [self prepare];
  NSData *data = self.sounds[cue];
  if (!data) { return; }
  self.player = [[AVAudioPlayer alloc] initWithData:data error:nil];
  [self.player play];
  if ([cue isEqualToString:@"complete"]) {
    NSUInteger token = self.generation;
    for (int note = 0; note < 2; note++) {
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(note * 0.26 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (token != self.generation) { return; }
        if (note == 1) { [self.strong impactOccurred]; }
        else { [self.light impactOccurred]; }
      });
    }
  } else if ([cue isEqualToString:@"start"]) {
    [self.strong impactOccurred];
  } else {
    [self.light impactOccurredWithIntensity:0.6];
  }
}
@end
