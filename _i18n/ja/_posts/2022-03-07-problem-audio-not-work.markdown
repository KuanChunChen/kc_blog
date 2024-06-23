---
layout: post
title: "Android Audio 適配疑難雜症分享：探討如何解決 Android 設備上的音頻問題"
date: 2022-03-07 14:31:22 +0800
image: cover/android-audio-share-1.png
tags: [Android,Debug]
categories: Debug探討
excerpt: "我們將探討如何解決 Android 設備上的音頻問題，如果你是 Android 開發人員或對音頻技術感興趣，這份分享絕對不能錯過！"
---

<div class="c-border-main-title-2">前言</div>

在今天的分享中，我們將探討當兩個客戶端設備進行連接時，<br>
通過手機收音並播放到另一端時，其中一端的聲音會出現一些問題，<br>
例如雜訊、音量不穩定和突然變化等。<br>
我們將分析這些問題的可能原因，<br>
並提供解決方案，<br>
如果你有類似的問題，<br>
或者對此感興趣，<br>
歡迎參考這份分享。

<div class="c-border-main-title-2">分析過程分享</div>
<div class="c-border-content-title-4">第一步：覆現問題</div>
   * 在 `Samsnug SM-G900I Android 6.0.2` 上測試 覆現得到的結果<br>
      - 情況: 背景有播放音樂的時<br>
     Clinet A  與 Client B 連線成功時 愈進行通話 (收音傳給另一端) <br>
     Clinet A 手機音樂聲音會有雜訊、忽大忽小聲、突然變大聲等<br>
      - 預期: 背景有播放音樂的時 播放音樂不受影響

<div class="c-border-content-title-4">第二步：找問題方向</div>
   * 初期方向以下列幾個方式來嘗試解決此問題
     - Read App source code 並試著把某些code mute掉測試哪段會實際影響<br>
       例如：`Mute掉AudioRecord、AudioTrack`等，以此來降低問題範圍<br>

     - `發想相關可能性`，如 研究`音頻焦點`：
       因此發現其特性<br>
       手機一次只能有一個app拿到音频焦点<br>
       各個app也可以自行設置焦點遺失的監聽<br>
       故若偵測到此監聽<br>
       則各個app有可能自行降低音量(此為不可控)<br>
       不過會再研究看看目前程式碼有無行為會取音频焦点<br>
     - Surf the internet and find if there are same problem others used to occur.<br>
       例如：參考網路文章
        1. [Android音頻與其他應用重音的問題](https://www.itread01.com/content/1541940035.html)
        2. [Android Developer 处理音频输出的变化](https://developer.android.com/guide/topics/media-apps/volume-and-earphones)
        3. [Android 音頻系統](https://www.twblogs.net/a/5d160b34bd9eee1e5c828cb5)
        4. [Android Developer 管理音频焦点](https://developer.android.com/guide/topics/media-apps/audio-focus)

<div class="c-border-content-title-4">第三步：找問題答案</div>
  * 為了降低解決問題時間與提升效率達到預期效果，<br>
    所以會先經歷上面第二步，思考看看可能的方向與解法，<br>
    避免一開始就一腦砸下去研究，<br>
    研究到最後才發現找錯方向，<br>
    間接變成你更沒效率，<br>
    所以我習慣都會先思考一下可能性<br>

  * 所以透過上面分析，後來有幸發現幾種方法
      - 透過調整`硬體抽象層HAL`，<br>
        但是因為我們是開發Android應用層，<br>
        所以要改`HAL`的可能性就很低了，<br>
        除非是硬體開發商，想從根本改變這個規則<br>
        這邊是網路上其他人分享改法：<br>
        [调试笔记 --- 实时录音会有呲呲噪音问题](https://blog.csdn.net/kris_fei/article/details/71223117)

      - 另一種則是，修改AudioSource收音來源
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
        我們原本的source code是使用 `AudioSource.VOICE_COMMUNICATION`<br>
        經實測使用`AudioSource.MIC` or `AudioSource.VOICE_RECOGNITION` 來錄音 <br>
        這個情境下則不會 有雜音 或聲音變大變小的情形<br>

        `嘗試後行為記錄`：<br>
        (這邊是for我這個例子，如果你也遇到一樣 可以參考看看 但還是建議自行測測看)<br>
          - `AudioSource.VOICE_COMMUNICATION` 會造成大小聲、破音、雜音，能收到音但Parent收到的音頻聽起來有延遲<br>

          - `AudioSource.VOICE_PERFORMANCE` 不會大小聲、但Parent端收不到音<br>
          - `AudioSource.REMOTE_SUBMIX` 不會大小聲、但收音只收得到系統按鍵音<br>

<div class="c-border-main-title-2">其餘知識點紀錄</div>

* 後來發現 Audio HAL 存在版本差異
快速科普各Android版本的Audio HAL使用差異：
  <table class="rwd-table">
    <thead>
      <tr>
        <th class="tg-2wgr">Android Version</th>
        <th class="tg-2wgr">Audio HAL Version</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-72zf">Less then Android 8</td>
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
   × 內容依據官方公佈，若供應商未自行更改Audio HAL的前提下版本如上

   * 舊版Audio HAL資訊可參考：[官方文檔](https://source.android.com/devices/architecture/hal)<br>

   * 可查看 [舊版Audio HAL Source code](https://android.googlesource.com/platform/hardware/libhardware/+/master/include/hardware/audio.h)
   <br>

   * [舊版Audio.h](hardware/libhardware/include/hardware/audio.h)
   <br>

   * 新版Audio HAL則可[參考這](https://cs.android.com/android/platform/superproject/+/master:hardware/interfaces/audio/README.md)
     故可能各版本HAL間有些微差異，可針對問題研究並在應用層調配成最符合需求的樣子
   <br>

   * 使用指令 `adb shell lshal` 可查看當前HIDL的版本 (Android 8.0後才有接一層HIDL出來)
`HIDL = 可以想像成HAL的AIDL`

<div class="c-border-main-title-2">終場總結</div>
 * 最後這個問題
  我那時候就改了一個小小的地方
  就是把收音的
  `AudioSource.VOICE_COMMUNICATION`改成`AudioSource.MIC`
  就能達到預期的效果

 * 有時候解決一個問題，<br>
  因經驗 或 問題可能無法一眼看出，<br>
  像是這種硬體調適的問題，<br>
  可能就需要一一的去了解與分析，<br>
  最後雖然只做了一行code改變，<br>
  但你卻可以從解決問題的過程中<br>
  更了解你在開發的東西實際的一些know-how<br>
  也助於未來遇到其他問題或 可能有相關的<br>
  這些就能變成你未來的經驗<br>

 * 當然還是得看不同問題<br>
  決定要花多少時間去解<br>
  是不是有助於你的發展<br>
  這些都是你必須自己去思考的<br>

 * 不過我習慣研究多一點<br>
  以免到時候解決問被問問題<br>
  不知道自己怎解的<br>
  所以算是額外的一種保險行為<br>
