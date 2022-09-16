---
layout: post
title: "[Android][2022][Debug][Problem Solved Series]Android Device owner 權限請求與實際作用統整"
date: 2022-04-25 18:19:28 +0800
image: cover/problem-solved.jpeg
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
android 內提供的 Device owner權限
怎麼獲得它還有能做什麼事
在這篇我把整過過程分享給大家
<br>

### 為何要成為Device Owner
因為這個權限可以讓你使用Android官方提供的 DevicePolicyManager裏面的API<br>
去執行一些普通權限無法達到的需求<br>
請參考
[DevicePolicyManager文件](https://developer.android.com/reference/android/app/admin/DevicePolicyManager)

補充：
除了Device Owner外
下面這個指令 也能透過adb 修改指定app權限
`adb shell pm grant com.your.package android.permission.CHANGE_CONFIGURATION`
### 如何成為Device Owner

這邊有幾種方式 可以讓你的Android app 成為device owner  

* 第一種：Factory Reset後 進入welcome頁面 點擊 Welcome字樣 7下 用開啟的相機 掃描 QR Code
* 第二種：Factory Reset 點 8 下 後掃描 QR Code (需要有 GMS)

這兩種其實類似 只是可能不同廠商有可能會遇到不同方式<br>
這邊你需要製作一個QR code 掃描讓 這兩個步驟運作

1. 使用下方指令 apk_download_link帶入你apk的下載url<br>
`curl -s [apk_download_link] | openssl dgst -binary -sha256 | openssl base64 | tr '+/' '-_' | tr -d '='`
2. 利用下方Json格式，填好你的value<br>
`android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME`：填入你的packageName/AdminReceiver的路徑<br><br>
`android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM`：填入步驟1產生的hash code<br><br>
`android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION`：填入你的download url<br>
```
{
	"android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME":"com.xxx.your.package.name/com.xxx.your.package.name.receivers.AdminReceiver",
	"android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM":"64l05FpmjfKvyAE67J9kLURBtdAgHIyKo_sKyha1h5E",
	"android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION":"https://your_web_site_url.apk"
}
```
3.拿著步驟2的json格式 去產生QrCode<br>
之後只要在Factory Reset後照著前面兩種方式把QR code相機打開<br>
讓用戶去掃描你產生的QrCode<br>
待系統設定好後<br>
那隻App就會自動安裝加上變成Device Owner<br>

這種方式通常是讓非開發人員去用的<br>
例如：各端開發人員先上傳好apk<br>
之後有apk download url後<br>
用上方步驟產生hash code 以及製作json格式的資料並製成QrCode <br>
方便讓非開發人員 透過UI操作就能產生Device Owner app

* 第三種：透過adb 指令讓指定app成為device owner<br>
  這邊只要把你指定app的Admin Receiver的路徑打在下方指令之後<br>
  就能讓該app變成device owner<br>
  `adb shell dpm set-device-owner com.your.package/com.your.package.receivers.AdminReceiver`
   - 不過這個指令有些限制<br>
   1.目前OS內不能有任何gms Account<br>
   就是一般要使用google 服務都會要你登入google帳號，可以到setting裡面把它移除<br>
   2.系統內只能存在一組用戶設定的Device owner，如果有的話可以先刪除，再重設需要的app<br>
   `adb shell dumpsys device_policy`<br>
   這個指令可以去看你目前OS內有的device owner情況


### 如何移除 Device Owner

* 透過指令移除 <br>
`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`
 - 這個指令需透過： <br>
 在`AndroidManifest.xml的<application>`內 <br>
 加入 android:testOnly="true"<br>
 方能移除 Device Owner
 - 加入device owner 權限的app <br>
 通常不能被被移除或adb install安裝<br>
 可加入-r -f 來強制覆蓋 : adb install -r -f ../xxx.apk
 或強制移除後再安裝

 * 透過官方API移除 <br>
 在device owner app內 <br>
 使用DevicePolicyManager內的 clearDeviceOwnerApp來移除權限<br>

 * 直接Factory Reset手機<br>
 以上其他方法都無法使用時，只能使出終極殺招XD
