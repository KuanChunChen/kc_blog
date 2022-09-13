---
layout: post
title: "[Android][2022]用adb來透過wifi 連接Android實機教學"
date: 2022-02-15 13:46:32 +0800
image: others/adb_wifi.png
tags: [Android,adb]
categories: Android
---


 ## 前言
 ---
 這篇主要來記錄下adb wifi cli的下法，因為以前都是用Android studio的插件直接來連手機
 所以不知道實際是怎下的，所以特別去查了下資料，並彙整才自己的筆記，這樣以後忘記還能回來看自己的筆記！


 <div align="start">
   <a href="{{site.baseurl}}/2022/02/22/android-adb-wifi-note-detail/">
     <img src="/images/others/adb_wifi.png" alt="Cover" width="30%"/>
   </a>
   <a href="{{site.baseurl}}/2022/02/15/android-adb-wifi-note-detail/">[Android][2022]Android 11 adb wireless debug 心得分享</a>
 </div>



 ## 實際作法
 ---
 1. 讓電腦與Android手機進入同一個區域網路
 2. 用USB線將Android手機連上電腦 要開啟開發者mode
 3. 透過以下指令尋找手機ip位址
 ```linux
 adb shell ifconfig
 ```
 4. 會找到類似192.168.xxx.xxx的IP
 5. 用以下指令切換到tcp/ip模式
 ```linux
 adb tcpip <port>
 ```
 這邊的port是可以自己指定的

 這邊分享一個雷：<br>
 因為之前都是用插件adb wifi直接連<br>
 所以這個插件設定的port都是同一組<br>
 只要你不是自己在家用<br>
 然後同公司又有其他人的port跟你設定一樣<br>
 他又也是在同個區域網路下<br>
 或他知道你ip + port 他就可以用指令下apk安裝到你的手機<br>

 所以其他人不知道你在用<br>
 也有可能誤發你的手機<br>
 所以如果你能自己設定port的話就可以避免互衝的問題<br>


 6. 最後使用指令<br>
 ```
 adb connect 192.168.0.101:5555
 ```
 就能用wifi控制你的手機了

 補充：
 後來愈到要連線上android TV的方式
 但剛好沒遇到沒有usb插槽的情況
 這時候就可以去設定->wifi->同個網路下去找ip
 就不用透過指令


### 其他筆記

- 補充Android 10 以下的 adb連線細節
  - 使用`adb connect`連上手機 **至少需連接一次USB線**，需先設定你的tcpip的port
 之後不用插線只要同ip跟port就能直接連

  - 一些俗稱adb wifi 插件通常預設port為5555，故有機會手機已設定過adb tcpip port
 有人同區網又知道你的ip，就能輕易嘗試connect，並控制手機
 (這裡試過 ， 對沒設定過 `adb tcpip` 的直接用預設5555 會被refused)
 ![adb-connect.png](/images/others/adb-connect.png)
  - 要斷連用 `adb disconnect <ip>:<port>`
  - 主要運作在adb server下 ，用 `adb kill-server` 亦會斷連
  - 找手機本地IP可以用 `adb shell ifconfig`，可看到類似的如下：
 ```
 wlan0   Link encap:Ethernet  HWaddr F0:XX:B7:XX:XX:97
         inet addr:192.168.X01.XXX  Bcast:192.XXX.X01.255  Mask:255.255.255.0
         inet6 addr: fe80::fxxxx:x2xx:fee1:7d97/64 Scope: Link
         UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
         RX packets:543 errors:0 dropped:0 overruns:0 frame:0
         TX packets:574 errors:0 dropped:0 overruns:0 carrier:0
         collisions:0 txqueuelen:1000
         RX bytes:198035 TX bytes:125461
 ```
   或是用這串CLI `adb shell ip route | awk '{print $9}'`
   直接取得目標IP
    ![adb-ip-photo.png](/images/others/adb-ip-photo.png)
