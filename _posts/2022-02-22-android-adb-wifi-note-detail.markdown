---
layout: post
title: "[Android][2022]Android 11 adb wireless debug 心得分享"
date: 2022-02-22 15:16:12 +0800
image: cover/android-adb-wirless-share-1.png
tags: [Android,adb]
categories: Android
---

### 前言
因為專案需求<br>
尋尋覓覓看有無其他使用adb debug的方式<br>
發現到一個Android 推出了一種方式<br>
這裡研究後的心得分享<br>

以前比較常用的方式前面也有一篇分享心得<br>
需要的大大可以參考<br>


<div align="start">
  <a href="{{site.baseurl}}/2022/02/15/android-adb-wifi-note/">
    <img src="/images/others/adb_wifi.png" alt="Cover" width="30%"/>
  </a>
  <a href="{{site.baseurl}}/2022/02/15/android-adb-wifi-note/">[Android][2022]用adb來透過wifi 連接Android實機教學</a>
</div>


### 針對Android 11 新出的adb wireless debug 研究[此篇](https://developer.android.com/studio/command-line/adb#connect-to-a-device-over-wi-fi-android-11+)

- `Android 11` 後續版本 新增wifi debug功能，首先環境需達到：
  1. Android 11 以上
  2. 連接的電腦或自己包的環境下 platform tool SDK版本必需大於 30.0.0 ( `adb version` 可查看當前sdk version)
  3. 需在同個區域網路下

- 實際操作 **(不需要 USB 線)**
  1. Android手機至setting開啟開發者模式並進入找到‘Wireless debugging’開啟
  2. 進入Wireless debugging子選單
  3. 點pair device with code 進入查看ip、port還有paring code.
  4. Terminal上 `adb pair <ipaddr>:<port>` 輸入指令配對
  5. 出現 `Enter pairing code:` 則輸入步驟3看到的paring code.

- 特色
  1. Wireless debugging內可看到已經配對過的device，可管理刪除
  2. 下次重開會自動重連
  3. 無需USB線即可配對
  4. 與舊版(Android10以下)adb 連wifi不同 ，舊版每次連都要手動重連
     - 簡述Android 10 以下 adb連線方法  **(需要借助 USB 線)**
       a. 切換tcpip port : ` adb tcpip <port>`
       b. ` adb connect <ip>:<port>` 輸入ip 與剛剛的port來連接


### 其他筆記
  - Android 11 AOSP 內develop option 內的 WirelessDebuggingFragment內 看看能否知道如何產生pair code<br>
    -> AOSP folder路徑 ： `/Android/11/packages/apps/Settings/com/android/settings/development/WirelessDebuggingFragment.java`<br>

    這邊我看的結果看起來他需要特殊的key才能產生，<br>
    不確定 `應用層` 能不能做到 <br>
    有興趣研究的可以再去AOSP內看看<br>

  - 部分機種Android 11 沒支援，意思是有可能廠商會鎖這項功能，如：LG 手機<br>
     -> 開發者選項中看不到wireless debuging選項，<br>
     故實際有無支援還是要看該廠商燒的OTA有沒有帶<br>

  - `adb connect <ip>:<port> 連線`` <br>
     -> 用這個來測試連線是否能連到wireless debug 頁面上的那組`IP:port`<br>
     但這指令一種是用來連線tcpip的ip(需要線)<br>
     另一種則是恢復有記錄在wireless debuging下已pair過的device<br>
     故僅能拿來手動恢復連線<br>
