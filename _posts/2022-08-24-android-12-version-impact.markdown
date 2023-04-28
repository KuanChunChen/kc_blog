---
layout: post
title: "[Android][2022][Problem Solved Series] Android 12 版本差異分享"
date: 2022-08-24 14:39:48 +0800
image: cover/android-version-adaptation-12-1.png
tags: [Android,Debug,ota,aosp]
categories: Debug
---

這篇文章主要會分享過去我在開發時<br>
當版本升級時遇到的一些問題<br>
主要會以遇到的問題分析<br>

如需看了官方改了什麼<br>
可以直接去[Android Developer](https://developer.android.com/about/versions/12/behavior-changes-all)觀看<br>


## Android 12 受影響的功能

* Android 12以上 新增OS相機與麥克風 權限開關
  - 使用者可透過start bar內的快捷按鈕 或是設定內`相機或麥克風存取權`開關做關閉
  - 可能影響使用到遠程相機的使用體驗，<br>
  即使開啟相機權限，<br>
  但只要使用者關閉相機存取權，<br>
  則會給一個黑屏的相機<br>
  麥克風亦是如此:[參考](https://developer.android.com/training/permissions/explaining-access#toggles)

  - 目前看到有下方code ，可去偵測系統是否支援，來給使用者做提示，目前暫時沒看到可以判斷是否開啟的API
  <script src="https://gist.github.com/KuanChunChen/c7469603bb0f6b6b533447c7d7c9e0cf.js"></script>

---
---

 * Android 12以上 棄用了 ACTION_CLOSE_SYSTEM_DIALOGS:[參考](https://developer.android.com/about/versions/12/behavior-changes-all#close-system-dialogs)
   - 但在Android 13上實測 開啟輔助權限時，還是可以送出 ACTION_CLOSE_SYSTEM_DIALOGS
   但沒開就不會收到該廣播

---
---
 * Android 12以上 對splash 畫面新增預設啟動畫面[可透過該頁面教學遷移新的splash](https://developer.android.com/guide/topics/ui/splash-screen/migrate)
   - 如下多了一個預設icon的啟動畫面<br>
     ![android12_splash_icon.gif](/images/others/android12_splash_icon.gif)
   - 這邊實測後，目前這個default splash screen無提供移除的方法<br>
     只有移除原本自定義Activity不顯示畫面但還是可跑原本週期的方法<br>
     官方也針對新的splash screen有一些規格:[參考](https://developer.android.com/guide/topics/ui/splash-screen#elements)<br>
   - 調整思路：<br>
     - 將`implementation 'androidx.core:core-splashscreen:1.0.0'`加入build.gradle<br>
     這邊需注意min sdk要求為21以上<br>
     ![android12_splash_min_sdk.png](/images/others/android12_splash_min_sdk.png)
     - 設定新的splash screen的Theme
     <script src="https://gist.github.com/KuanChunChen/dd55d7b2cb70cedf158763083390d426.js"></script>
      `windowSplashScreenBackground`為背景顏色，實測只能設定@color<br>
      `windowSplashScreenAnimatedIcon`為中間那個圓型view的icon，可設置圖片，但大小只能依照官方公佈的<br>
      `windowSplashScreenBrandingImage`為icon下方一小塊的背景圖片<br>
      `windowSplashScreenAnimationDuration`為動畫時間<br>
      [其他屬性](https://developer.android.com/guide/topics/ui/splash-screen#set-theme)
      <br>

     - 將新的SplashTheme加入`AndrodManifest.xml`

     - 加入初始code
     <script src="https://gist.github.com/KuanChunChen/7799d22f3d2839965678d9f75435bda5.js"></script>

     `SplashScreen.installSplashScreen(this)`需在`super.onCreate`前<br>
     <br>
     `splashScreen.setKeepOnScreenCondition(() -> true );`<br>
     這行可以讓原本舊的activity畫面不顯示但activity週期會跑<br>
     但這個做法就是用新的官方splash，原本客製化的畫面就不顯示了，這邊各位`product owner可自行考量   `

---
---
  * 在Android target sdk 12以上 在intent-filter中未宣告android:exported 的值 則可能造成無法安裝
    - 如圖，當編譯後要安裝，則顯示如下 `INSTALL_PARSE_FAILED_MANIFEST_MALFORMED` 錯誤
     ![android12_exported_crash.png](/images/others/android12_exported_crash.png)
    - 另外當使用到PendingIntent時也需加入對應flags不然會報錯：
      <script src="https://gist.github.com/KuanChunChen/7ba7f042607cde3cb472af503088bce9.js"></script>
    - 解法 ＆ Demo：<br>
      - 需在每個PendingIntent創建處加入`FLAG_IMMUTABLE`或 `FLAG_MUTABLE` 標籤<br>
      - 以及加入最新work-runtime： `implementation 'androidx.work:work-runtime:2.7.1'`<br>
      ![android12_workmanager.png](/images/others/android12_workmanager.png)<br>
      - 備註<br>
        - 這邊以Airdroid為例的話 目前Airdroid & httphelper repo分開所以其他有的地方也需修正
        - 隱性PendingIntent也需修改，因implement的library內也有用到PendingIntent
        如以目前`Airdroid`專案內使用到google analytics 17.0.0版，但亦出現error提示
        (這種要實際跑到該段code才會知道是否有PendingIntent的error)
        ![android_12_error_01.png](/images/others/android_12_error_01.png)
        這時候將版本升上去即可
        `implementation 'com.google.android.gms:play-services-analytics:18.0.1'`



---
---

  * 把Target sdk 升到32時 `setAppCacheEnabled(flag Boolean)`與`setAppCachePath(path String)` 被移除了   
    - 因為Chromium將這項功能移除，所以sdk變成不再支援 ，[參考](https://web.dev/appcache-removal/)
    ![android12_appcache.png](/images/others/android12_appcache.png)

---
---

  * 把Target sdk 升到32時 ，背景運行時啟用前景服務受到[限制](https://developer.android.com/guide/components/foreground-services#background-start-restrictions)
     - 這個目前實測在SDK 32上，還是可以在後台執行前台服務
       先嘗試了在後台Service中執行StartForegroundService，不過可以正常執行，這邊會再追蹤看看

     - 官方建議使用WorkManager 來替代執行：[參考](https://developer.android.com/about/versions/12/foreground-services?hl=zh-cn#recommended-alternative)

---
---
 * 為了鼓勵節省系统資源，<br>
 鬧鐘管理器 API 在Androd 12需聲明`SCHEDULE_EXACT_ALARM`權限才能使用
---
---
 * Android 12以上針對移動傳感器做了採樣率的限制[參考(英文官網才看得到，中文沒這段)](https://developer.android.com/guide/topics/sensors/sensors_overview#sensors-rate-limiting)
   - 使用registerListener()來註冊傳感監聽器來monitor sensor events時，最高採樣率限制200Hz
   - 想用更高HZ則必需加入`HIGH_SAMPLING_RATE_SENSORS`權限

---
---
 * Android 12 行為變更-大致位置/精確位置，在此版本上要求請求權限時，<br>
 需同時請求`ACCESS_FINE_LOCATION`與`ACCESS_COARSE_LOCATION`，<br>
 才會顯示新的位置權限請求框
 有遇到的可以注意下:[參考](https://developer.android.com/training/location/permissions#approximate-request)

---
---
 * Android 12對藍牙權限做了權責分離:
      - 原本使用藍芽相關api時需宣告
        `Manifest.permission.BLUETOOTH_ADMIN`與`Manifest.permission.ACCESS_FINE_LOCATION`
        來獲取搜尋附近藍芽裝置

      - `AirDroid`內有用到startDiscovery..等API來搜尋附近裝置
        使用舊的權限在Target 32時，`API返回fail 或部分API直接crash `
        ![android12_ble.png](/images/others/android12_ble_crash.png)

      - 可類似這樣修改：
        1. 舊的權限加入`android:maxSdkVersion="30"`
        2. 根據需求宣告新的權限`BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`或`BLUETOOTH_ADVERTISE `
        ![android12_ble.png](/images/others/android12_ble.png)
        3. 以前runtime權限請求只要求`ACCESS_FINE_LOCATION`權限，現在分開了，得在runtime時新增上述`藍芽權限請求`

      - 參考 [api文檔](https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#startDiscovery())與[藍牙權限分離說明](https://developer.android.com/guide/topics/connectivity/bluetooth/permissions#declare-android12-or-higher)
      - 這裏是簡單demo如何改
      <script src="https://gist.github.com/KuanChunChen/cd5950dcc9247ea889e835a4085694f8.js"></script>
