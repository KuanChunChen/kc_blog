---
layout: post
title: "[Android][2022][Debug][Problem Solved Series]Android log 抓取方式彙整-讓非開發人員更快抓log"
date: 2022-04-18 16:37:48 +0800
image: cover/android-photo-ascii-art.png
tags: [Android,Debug]
categories: Debug
---

### 前言

* Hi Internet<br>
這系列文章將記錄我`曾經開發Android遇到的問題`<br>
`分析問題`時做的一些筆記<br>
我預計要整理出我過去遇到的問題<br>
做成一系列<br>
這樣未來再遇到可以更快找回記憶<br>
也可幫助有遇到相同問題的朋友們<br>
或是分享一下如果遇到問題<br>
要怎麼找答案的過程<br>

* 今天要分享的是<br>
過去開發常常會被問<br><br>
有什麼方法可以抓log<br>
`或是怎麼讓測試或其他非開發人員更快抓到Android log`<br>
所以這裡就整理了一些簡單的方式<br>
讓大家參考<br>

<br>

### Android log 抓取基本觀念補充

  * [確認Android 架構各層可以點這裡](https://developer.android.com/guide/platform)    

  * logcat抓log ，logcat 只抓 Framewrok內 的 log
    - 整包 log : `adb logcat`  -> [篩選log參考](https://developer.android.com/studio/command-line/logcat#options)

    - 查看各 buffer size : `adb logcat -g`
    - 可以查到多種buffer內 log : radio、events、main、system、crash、all、default..等等
    - 例如：
    ```
    [adb] logcat [-b 'buffer name']
    ```
    main buffer log : `adb logcat -b main`
    events buffer log : `adb logcat -b events`
    以此類推
    - 各區差異可參考 ：[查看備用日志緩衝區](https://developer.android.com/studio/command-line/logcat#alternativeBuffers)

<br>

### Android log 抓取思路

  * adb 抓取系統log file ：
    - 需權限
      - 拉出 Kernel panic log :`adb pull /sys/fs/pstore/console-ramoops`

      - 印出 Kernel log：`adb shell cat /proc/kmsg` (抓取當前那次的log、第二次呼叫同指令會從上次結束後的log後面開始顯示)

      - Linux kernel-ring buffer log : `adb shell su dmesg` ([dmesg指令參考](https://man7.org/linux/man-pages/man1/dmesg.1.html))

    - 不用權限
      - 拉出 ANR log : `adb pull /data/anr`

 <br>

  * 從安卓應用執行指令：
    - 開一個procees可以去執行commend :
    例如：`Runtime.getRuntime().exec("logcat -b radio")`

    - Android 4.1 前 在Manifest.xml加入 `READ_LOGS` 權限
        取得`READ_LOGS`權限 後，`則可以拿到原本需要su權限的log`

    - Android 4.1 後 google將此評為10大Bad permission : [google developer相關影片](https://www.youtube.com/watch?v=WDDgoxvQsrQ&t=1323s)

    - 因此 Android > 4.1 時 使用權限被變更為 `“signature|privileged”`
       等同於 需要有 `系統簽名` 或
       build image時包在特權資料夾`../priv-app`的app ([特許權限白名單](https://source.android.google.cn/devices/tech/config/perms-whitelist?hl=zh-cn))
       才能取得該`READ_LOGS`權限

    - 如果透過PC下指令：
      `adb shell "pm grant <package name> android.permission.READ_LOGS && am force-stop <package name>" `

       可以打開`READ_LOGS`權限 + 強制關閉app （因下完要重啟app才會生效）
       要關閉權限則將`grant`改成`revoke`

<br>

  * 透過pc端執行指令：

       - 使用 adb logcat 亦可以取得當前log
       - 不過跟上方一樣 部分指令需要授權才能用

<br>

  * 土法煉鋼：

    - 編寫程式碼在android app 內寫下 log 至對應資料夾<br>
      之後再用adb pull 拉出來

    - 如寫好後，用adb拉出來<br>
      `adb pull /sdcard/Android/data/your.package.name/files/`
<br>

  * Scrpit or shell 大法：

    - 透過寫好的shell直接小黑窗執行在背景抓log
    - 這邊分享個簡易的寫法：<br>
     ![shell_log.png](/images/others/shell_log.png)
      - 主要需注意的就是要從頭到尾自己掌握<br>
      - 如要帶入你的app packageName<br>
      - 要配置好你adb的路徑 <br>
        (如果你要給非開發人員用 也可以配置./adb 在你同個資料夾的路徑 讓電腦沒裝adb的人也能執行)
      - (optional) 可以自定義輸出的log file name 也可以自行帶入時間碼來區分等等<br>
<br>
    - 最後寫好就可以執行<br>
      也可以把它包成工具給第三者測試用<br>
      ![shell_log_start.png](/images/others/shell_log_start.png)

      就開始抓囉！
