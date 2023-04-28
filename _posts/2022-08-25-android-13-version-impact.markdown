---
layout: post
title: "[Android][2022][Problem Solved Series] Android 13 版本差異分享"
date: 2022-08-25 11:11:58 +0800
image: cover/android-version-adaptation-13-1.png
tags: [Android,Debug,ota,aosp]
categories: Debug
---

這篇文章主要會分享過去我在開發時<br>
當版本升級時遇到的一些問題<br>
主要會以遇到的問題分析<br>


---
---

 * Android 13以上 電池用量新限制:[參考](https://developer.android.com/about/versions/13/changes/battery#restricted-background-battery-usage)
  - Android 13 為目標平台時，除非應用因其他原因啟動，否則係統不會傳送以下任何廣播：
      - BOOT_COMPLETED
      - LOCKED_BOOT_COMPLETED

---
---

 * 把`BUILD_SDK`版本升上33後 ByteArrayOutputStream內多了一個 writeBytes(byte data[])方法<br>
 剛好之前在開發遇到剛好有人有自己寫了一個`writeBytes`方法
 所以剛好重名，導致編譯出錯
![android13_lib_error.png](/images/others/android13_lib_error.png)<br>
  - 這邊若有考慮要把build sdk升上去 project owner可以考慮移除,改名或在前面加入public

---
---

 * 如果有Device Admin 權限，未使用應用程式則移除權限則永遠關閉。
  （自測發現如果把 Device admin 權限關閉，此權限還是制灰無法修改）

---
---

* 存取權限細化
  - 只要求舊的權限會crash，不過可以用`所有檔案存取權`取代
  ![android13_access_permission.png](/images/others/android13_access_permission.png)
  - AirDroid有請求`所有檔案存取權`，所以目前不用修改，下方為跳轉到該頁面的Intent <br>
    `new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);`
  - 遇到要修改可參考demo：
  <script src="https://gist.github.com/KuanChunChen/d75998c921b176e659c911a938da4930.js"></script>
