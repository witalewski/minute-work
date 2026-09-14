package com.minutework.emomtimer

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import android.view.Window
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import kotlin.math.PI
import kotlin.math.sin

class WorkoutFeedbackModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val sounds = mutableMapOf<String, ShortArray>()
  private var player: AudioTrack? = null
  private var awakeWindow: Window? = null

  private fun vibratorIfPermitted(): Vibrator? {
    if (reactApplicationContext.checkSelfPermission(Manifest.permission.VIBRATE) !=
        PackageManager.PERMISSION_GRANTED) return null
    @Suppress("DEPRECATION")
    val vibrator = reactApplicationContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    return vibrator?.takeIf { it.hasVibrator() }
  }

  @ReactMethod
  fun playVibration(cue: String) {
    try {
      val vibrator = vibratorIfPermitted() ?: return
      vibrator.cancel()
      val pattern = when (cue) {
        "countdown" -> longArrayOf(0, 80)
        "start" -> longArrayOf(0, 300)
        "complete" -> longArrayOf(0, 80, 180, 240)
        else -> return
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
      } else {
        @Suppress("DEPRECATION")
        vibrator.vibrate(pattern, -1)
      }
    } catch (_: SecurityException) {
      // Permission can change between checking and calling the system service.
      // Optional feedback must never interrupt the workout.
    }
  }

  @ReactMethod
  fun stopVibration() {
    try {
      vibratorIfPermitted()?.cancel()
    } catch (_: SecurityException) {
      // Even cancel() requires VIBRATE permission.
    }
  }

  override fun getName() = "WorkoutFeedback"

  @ReactMethod
  @Synchronized
  fun prepare() {
    if (sounds.isEmpty()) {
      for (cue in listOf("countdown", "start", "complete")) {
        sounds[cue] = soundForCue(cue)
      }
    }
  }

  @ReactMethod
  @Synchronized
  fun play(cue: String) {
    stop()
    prepare()
    val samples = sounds[cue] ?: return
    try {
      val track = AudioTrack.Builder()
          .setAudioAttributes(AudioAttributes.Builder()
              .setUsage(AudioAttributes.USAGE_MEDIA)
              .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
              .build())
          .setAudioFormat(AudioFormat.Builder()
              .setSampleRate(44100)
              .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
              .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
              .build())
          .setTransferMode(AudioTrack.MODE_STATIC)
          .setBufferSizeInBytes(samples.size * 2)
          .build()
      player = track
      check(track.write(samples, 0, samples.size) == samples.size)
      track.play()
    } catch (error: RuntimeException) {
      stop()
      Log.w(name, "Unable to play workout cue: $cue", error)
    }
  }

  @ReactMethod
  @Synchronized
  fun stop() {
    player?.let { track ->
      try {
        if (track.playState == AudioTrack.PLAYSTATE_PLAYING) track.stop()
      } finally {
        track.release()
      }
    }
    player = null
  }

  // This is also part of the existing JS bridge contract.
  @ReactMethod
  fun setScreenAwake(awake: Boolean) {
    UiThreadUtil.runOnUiThread {
      if (awake) {
        val window = reactApplicationContext.currentActivity?.window
        if (awakeWindow == null && window != null &&
            window.attributes.flags and WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON == 0) {
          awakeWindow = window
          window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
      } else {
        awakeWindow?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        awakeWindow = null
      }
    }
  }

  override fun invalidate() {
    stop()
    stopVibration()
    setScreenAwake(false)
    super.invalidate()
  }

  // Match the iOS PCM tones, including the attack/release envelope.
  private fun soundForCue(cue: String): ShortArray {
    val complete = cue == "complete"
    val start = cue == "start"
    val duration = if (complete) 0.76 else if (start) 0.6 else 0.1
    return ShortArray((44100 * duration).toInt()) { index ->
      val time = index / 44100.0
      val note = if (complete) minOf(1, (time / 0.26).toInt()) else 0
      val local = if (complete) time - note * 0.26 else time
      val length = if (complete) { if (note == 1) 0.5 else 0.2 } else duration
      val envelope = minOf(local / 0.008, (length - local) / 0.02).coerceIn(0.0, 1.0)
      val frequency = if (complete) { if (note == 1) 783.99 else 523.25 }
          else if (start) 880.0 else 660.0
      (sin(2 * PI * frequency * local) * envelope * 8000).toInt().toShort()
    }
  }
}
