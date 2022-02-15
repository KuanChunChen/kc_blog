---
layout: post
title: "[Android][2022]用adb來透過wifi 連接Android實機教學"
date: 2021-02-15 13:46:32 +0800
image: cover/android-photo.jpg
tags: [Android,adb]
categories: Android
---


 ## 前言
 ---
 這篇主要來記錄下adb wifi cli的下法，因為以前都是用Android studio的插件直接來連手機
 所以不知道實際是怎下的，所以特別去查了下資料，並彙整才自己的筆記，這樣以後忘記還能回來看自己的筆記！


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
