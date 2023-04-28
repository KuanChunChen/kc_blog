---
layout: post
title: "[Android][2022][Debug][Problem Solved Series]Android VpnManager 開發VPN app思路分享"
date: 2022-04-21 18:09:28 +0800
image: cover/android-vpn-app-develop-1.png
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
過去開發時有個需求時要自己在app內實作VPN方案時<br>
該怎麼做呢<br>
這邊分享我過去研究的相關筆記<br>
<br>

### 前期可以考慮的問題

 `思考要怎麼實作，所以先研究了有哪些方法可以達到VPN實作`

  - 原生方法：

      - 如果用`VpnManager` ，僅提供部分Vpn連線模式，且高版本(api 30上)才有提供

      - 如果用`VpnService` ，僅提供設定基本的一些設定，無開放連線模式的接口給上層使用

  - 在看了官方`VpnManager`的文件，需api 30才能使用，且也只有開放部分protocol

      - 另外有看到google issue tracker的網站中，
   有其他開發者有類似問題，並`詢問官方是否能開放下層的連線模式`給上層使用，
   官方人員回覆 後續有望開放：[點此查看](https://issuetracker.google.com/issues/203461112)


 * 這邊看了原本AOSP內有的連線加密方式：

   - PPTP  
   - L2TP/IPSec PSK
   - IPSec Xauth Psk
   - IPSec IKEv2 PSK
   - L2TP/IPSec RSA
   - IPSec Xauth RSA
   - IPSec 混合 RSA
   - IPSec IKEv2 RSA

<br>

 *  但根據前面提到官方只有提供部分方式給app使用<br>
   其他只能自己實作、或用第三方lib提供的方式串接<br>
   這張圖是官方提到有支援的加密方式
   有三種：`IPSec IKEv2 PSK`、`IPSec IKEv2 RSA`、`IPSec User Pass`
   ![vpn_limit.png](/images/others/vpn_limit.png)

### VPN實作的思路參考

* 以服務端[通用文件-Vpn](https://server-doc.airdroid.com/#/develop_progress/biz_policy?id=%e8%ae%be%e7%bd%ae%e9%a1%b9)並使用`官方提供`的方法來實作：
     - `'連接類型'`：透過[VpnManager](https://developer.android.com/reference/android/net/VpnManager) (API level 30以上)的[provisionVpnProfile](https://developer.android.com/reference/android/net/VpnManager#provisionVpnProfile(android.net.PlatformVpnProfile))方法設定`PlatformVpnProfile`
         - 官方定義一個新的類別 [PlatformVpnProfile](https://developer.android.com/reference/android/net/PlatformVpnProfile)
           - 若搭配AOSP看的話，官方是提供這個類讓你`設定部分連線procotol`
             最後到下層的Service時會幫你轉換成真正在Service用的VpnProfile類
           - 也就是VpnManager的 `line 335` : [provisionVpnProfile(@NonNull PlatformVpnProfile profile)](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnManager.java;l=339;drc=03ba62861cd60978ba51c144071512b4aac291b7)
        最後是用 toVpnProfile()幫你把`PlatformVpnProfile`轉為`VpnProfile`

         - 其中[Ikev2VpnProfile.Builder](https://developer.android.com/reference/android/net/Ikev2VpnProfile.Builder#setRequiresInternetValidation(boolean)) 可以設定Ikev2相關連線設置，這個類其實就是實作`PlatformVpnProfile`讓你去設定開放的protocol模式

     - `'vpn設置相關'` : 通過[VpnService](https://developer.android.com/reference/android/net/VpnService)，在建立本地tunnel的時候加入`VpnService.Builder()`
       - 官方 [VpnService架構圖](https://developer.android.com/guide/topics/connectivity/vpn#service)
         - 此方法設定連線時的Tunnel，官方僅提供如下方example所示的方法
         給開發者使用
         - 雖然AOSP內有提供相關protocol連線，但是`尚未開放`給上層使用，
       故若需要相關protocol進行連線，則需自行開發
       - example :
        ```kotlin
       /***  Android level 14 up ***/
       val builder = VpnService.Builder()
       val localTunnel = builder
                          .setSession('VPN名字')  
                          .addAddress('服務器', 'prefix length')
                          .addRoute('轉發路由', 'prefix length')
                          .addDnsServer('DNS服務器')
                          .addSearchDomain('DNS 搜索域')
                          .establish()
         ```

<br>

### 透過其他或第三方方案來實作 知識點分享

   - AnyConnect：第三方VPN供應商，目前看到第三方廠商的VPN服務
      - [AnyConnect官方文件](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html)提到有提供 TLS、DTLS、IPsec IKEv2 等等的protocol
      - 另一份[AnyConnect文件](https://www.cisco.com/c/en/us/products/collateral/security/anyconnect-secure-mobility-client/data_sheet_c78-527494.html)提到要使用IPsec IKEv2 連接 需要[Cisco Adaptive Security Appliance](https://www.cisco.com/c/en/us/products/security/adaptive-security-appliance-asa-software/index.html#~features) 8.4以上
      - 使用此選項的話，需要與[廠商接洽](https://www.cisco.com/c/en/us/products/security/anyconnect-secure-mobility-client/index.html#~deployment)，才能得知如何開發、細節等
      - [此表](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect40/feature/guide/AnyConnect_Mobile_Platforms_and_Features_Guide.html)下方有個表解釋每個平台支持的Tunneling
      - [AnyConnect 4.10 release note](https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-android-anyconnect-4-10-.html)，文件較下面有提到Android版本上有部分相容性問題：
        - 像是Android 5.0、6.0 省電模式會與該服務衝突
        - Split DNS 無法在Android4.4 或 三星 5.x Android 設備運作
   - `(供參考)` 看到網路上有一解法去設定VpnProfile，透過反射framework內的方法直接使用:[Create VPN profile on Android](https://stackoverflow.com/questions/9718289/create-vpn-profile-on-android)
     - 但在Android 9.0以上此法已被修正，故推測有些較早期的手機可能使用這種方法
     - [修正公告](https://developer.android.com/distribute/best-practices/develop/restrictions-non-sdk-interfaces)
   - `(供參考)` 第三方 [openVpn](https://github.com/schwabe/ics-openvpn) 有提供Android開源
     - [說明文件](https://community.openvpn.net/openvpn/wiki/Openvpn23ManPage)提到支援`SSL/TLS`協議`(僅支援該協議)`
     - 加入openVpn到android專案方法：[點此](https://www.youtube.com/watch?v=gBMhaCujwrM)
     - [ics-openvpn FAQ](https://ics-openvpn.blinkt.de/FAQ.html)也有提到三星5.0手機問題

<br>

### 其餘知識點

- 透過app開啟自定義VpnService時，在Android 8.0 以上service運作新增[後台執行限制](https://developer.android.com/about/versions/oreo/background?hl=zh-cn#services)
   <br>

- 追蹤[android-10.0.0_r1 aosp內的 VpnService.java](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r1:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1) 其`line:176~179`使用了
   [IConnectivityManager.aidl](https://cs.android.com/android/platform/superproject/+/android-10.0.0_r10:frameworks/base/core/java/android/net/IConnectivityManager.aidl;bpv=0;bpt=0)，但目前在framework層找不到實作aidl的痕跡，
   故推測有可能是放在binder之類的，若要了解它怎麼實作的，可能要再研究底層code
   <br>

- 追蹤 [Android 12 aosp內的 VpnService.Java](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/VpnService.java;bpv=1;bpt=1;l=178)，其`line:178~181`使用的aidl改成[IVpnManager.aidl](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/android/net/IVpnManager.aidl)，
   source code內有另一個檔案為[VpnManagerService.Java](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/services/core/java/com/android/server/VpnManagerService.java;l=33;bpv=0;bpt=1)其中`line:293`的 ` provisionVpnProfile(VpnProfile profile,...)`<br>

   要求提供[VpnProfile](https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/java/com/android/internal/net/VpnProfile.java;l=61;bpv=0;bpt=0?q=VpnProfile&ss=android%2Fplatform%2Fsuperproject)實例，<br>
   看到該檔案的`line:97`得知其預設連線方案為：`public int type = TYPE_PPTP`  

   而目前看到上面提供的常數有：<br>
   ![vpn_aosp_type.png](/images/others/vpn_aosp_type.png)<br>
   故推測目前aosp內有支援這些連線模式<br>
   但因為沒有開放出來，所以無法直接使用
   只能從官方設定那邊使用
