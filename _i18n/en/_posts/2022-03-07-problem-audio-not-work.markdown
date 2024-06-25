---
layout: post
title: "Android Audio Troubleshooting: Exploring Solutions for Audio Issues on Android Devices"
date: 2022-03-07 14:31:22 +0800
image: cover/android-audio-share-1.png
tags: [Android,Debug]
categories: Debug探討
excerpt: "We will explore how to solve audio issues on Android devices. If you are an Android developer or interested in audio technology, this share is a must-read!"
---

<div class="c-border-main-title-2">Introduction</div>

In today's share, we will explore the issues that arise when two client devices are connected, <br>
and audio is recorded on one phone and played on the other. <br>
Problems such as noise, unstable volume, and sudden changes in volume may occur. <br>
We will analyze the possible causes of these issues <br>
and provide solutions. <br>
If you have similar problems <br>
or are interested in this topic, <br>
feel free to refer to this share.

<div class="c-border-main-title-2">Analysis Process Share</div>
<div class="c-border-content-title-4">Step 1: Reproduce the Issue</div>
   * Tested on `Samsung SM-G900I Android 6.0.2` and reproduced the results<br>
      - Situation: When background music is playing<br>
     When Client A and Client B successfully connect and start a call (audio is transmitted to the other end) <br>
     Client A's phone music will have noise, fluctuating volume, and sudden increases in volume<br>
      - Expectation: Background music should not be affected when playing music

<div class="c-border-content-title-4">Step 2: Identify the Problem Direction</div>
   * Initially, try to solve the problem using the following methods
     - Read the app source code and try muting certain code segments to test which part actually affects the issue<br>
       For example: `Mute AudioRecord, AudioTrack`, etc., to narrow down the problem scope<br>

     - `Brainstorm related possibilities`, such as studying `audio focus`:
       It was discovered that<br>
       only one app can hold the audio focus at a time on a phone<br>
       Each app can also set its own focus loss listener<br>
       So if this listener is detected<br>
       each app might lower the volume on its own (this is uncontrollable)<br>
       However, further research will be conducted to see if the current code has any behavior that takes audio focus<br>
     - Surf the internet and find if others have encountered the same problem.<br>
       For example: Refer to online articles
        1. [Issues with Android Audio and Other Apps Overlapping](https://www.itread01.com/content/1541940035.html)
        2. [Android Developer Handling Changes in Audio Output](https://developer.android.com/guide/topics/media-apps/volume-and-earphones)
        3. [Android Audio System](https://www.twblogs.net/a/5d160b34bd9eee1e5c828cb5)
        4. [Android Developer Managing Audio Focus](https://developer.android.com/guide/topics/media-apps/audio-focus)

<div class="c-border-content-title-4">Step 3: Find the Solution</div>
  * To reduce the time to solve the problem and improve efficiency to achieve the expected results,<br>
    we will first go through step two above, think about possible directions and solutions,<br>
    to avoid diving into research from the start,<br>
    only to find out later that the wrong direction was taken,<br>
    indirectly making you less efficient,<br>
    so I usually think about the possibilities first<br>

  * Through the above analysis, we later fortunately discovered several methods
      - By adjusting the `Hardware Abstraction Layer (HAL)`,<br>
        but since we are developing Android applications,<br>
        the possibility of changing `HAL` is very low,<br>
        unless you are a hardware developer wanting to fundamentally change this rule<br>
        Here is a method shared by others online:<br>
        [Debugging Notes --- Real-time Recording Noise Issue](https://blog.csdn.net/kris_fei/article/details/71223117)

- Another way is to modify the AudioSource recording source
  ```Java
   AudioSource.DEFAULT:默認音頻來源
         AudioSource.MIC:麥克風（一般主mic的音源）
         AudioSource.VOICE_UPLINK:電話上行
         AudioSource.VOICE_DOWNLINK:電話下行
         AudioSource.VOICE_CALL:電話、含上下行
         AudioSource.CAMCORDER:相機旁的麥克風音源
         AudioSource.VOICE_RECOGNITION:語音識別 (語音辨識的音源)
         AudioSource.VOICE_COMMUNICATION:網路語音通話  (用於網路通話的音源 如VoIP)
         AudioSource.VOICE_PERFORMANCE 實時處理錄音並播放的音源（通常用於卡拉ok app）
         AudioSource.REMOTE_SUBMIX 音頻子混音的音源
  ```
  Our original source code uses `AudioSource.VOICE_COMMUNICATION`<br>
  After testing, using `AudioSource.MIC` or `AudioSource.VOICE_RECOGNITION` for recording<br>
  In this scenario, there will be no noise or fluctuations in volume<br>

  `Behavior after testing`:<br>
  (This is for my example. If you encounter the same issue, you can refer to this, but it is still recommended to test it yourself)<br>
    - `AudioSource.VOICE_COMMUNICATION` causes volume fluctuations, distortion, and noise. The sound can be received, but the audio received by the Parent sounds delayed<br>

    - `AudioSource.VOICE_PERFORMANCE` does not cause volume fluctuations, but the Parent end cannot receive the sound<br>
    - `AudioSource.REMOTE_SUBMIX` does not cause volume fluctuations, but only system key sounds can be recorded<br>

<div class="c-border-main-title-2">Other Knowledge Points</div>

* Later, it was discovered that there are version differences in Audio HAL
Quick overview of the differences in Audio HAL usage across various Android versions:
  <table class="rwd-table">
    <thead>
      <tr>
        <th class="tg-2wgr">Android Version</th>
        <th class="tg-2wgr">Audio HAL Version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-72zf">Less than Android 8</td>
        <td class="tg-72zf">Old HAL</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 8</td>
        <td class="tg-tvi2">2.0</td>
      </tr>
      <tr>
        <td class="tg-72zf">Android 9</td>
        <td class="tg-72zf">4.0</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 10</td>
        <td class="tg-tvi2">5.0</td>
      </tr>
      <tr>
        <td class="tg-72zf">Android 11</td>
        <td class="tg-72zf">6.0</td>
      </tr>
      <tr>
        <td class="tg-tvi2">Android 12</td>
        <td class="tg-tvi2">7.0</td>
      </tr>
    </tbody>
  </table>
   × Content is based on official announcements, assuming the vendor has not independently modified the Audio HAL version as listed above

   * Information on the old Audio HAL can be referenced from: [Official Documentation](https://source.android.com/devices/architecture/hal)<br>

   * You can view the [Old Audio HAL Source Code](https://android.googlesource.com/platform/hardware/libhardware/+/master/include/hardware/audio.h)
   <br>

   * [Old Audio.h](hardware/libhardware/include/hardware/audio.h)
   <br>

   * For the new Audio HAL, you can [refer here](https://cs.android.com/android/platform/superproject/+/master:hardware/interfaces/audio/README.md)
     Therefore, there may be slight differences between HAL versions, and you can study the issues and adjust at the application layer to best meet your needs
   <br>

   * Use the command `adb shell lshal` to check the current HIDL version (HIDL was introduced after Android 8.0)
`HIDL = You can think of it as the AIDL of HAL`

<div class="c-border-main-title-2">Final Summary</div>
 * For this last issue,
  I made a small change at that time,
  which was changing the audio source
  from `AudioSource.VOICE_COMMUNICATION` to `AudioSource.MIC`
  to achieve the desired effect.

 * Sometimes solving a problem,<br>
  due to experience or the nature of the problem, it may not be immediately apparent,<br>
  like this kind of hardware tuning issue,<br>
  you might need to understand and analyze it step by step,<br>
  in the end, although you only made a one-line code change,<br>
  you can gain a better understanding of the practical know-how<br>
  of what you are developing through the problem-solving process,<br>
  which will help you in the future when encountering other issues or related problems.<br>
  These experiences can become valuable for you in the future.<br>

 * Of course, it still depends on the specific problem<br>
  to decide how much time to spend on solving it,<br>
  and whether it contributes to your development.<br>
  These are things you need to think about yourself.<br>

 * However, I tend to research a bit more<br>
  to avoid being asked how I solved a problem<br>
  and not knowing the answer.<br>
  So, it's an additional form of insurance.<br>
