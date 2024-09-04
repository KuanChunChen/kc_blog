---
layout: post
title: "Compose Multiplatform 實戰：在Android、iOS模擬器上跑CMP專案"
date: 2024-08-18 17:15:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-4
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>

`Compose Multiplatform (簡稱CMP)`<br>
昨天我們才剛建置好CMP專案<br>

若你有成功導入專案到IDE中<br>
可以看到類似下方的資料夾結構<br>
<img src="/images/compose/032.png" alt="Cover" width="50%" /><br />

這時候我們可以先試試看是否可以編譯<br>
若`成功`編譯<br>
可以看到類似下方畫面<br>
使用模擬器打開實作好的app畫面<br>
右下角會提示編譯成功與否訊息<br>
<img src="/images/compose/033.png" alt="Cover" width="65%" /><br />


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">安裝Android模擬器</div>
如果你是用昨天文章:[用Wizard創建CMP專案](https://ithelp.ithome.com.tw/articles/10343416)來創建的話<br>
那他基本的`專案配置都已經先幫你配好`了<br>

大致上你只要確保Day2時<a href="{{site.baseurl}}/compose-multiplatform-day-2">安裝CMP環境</a>時<br>
的系統環境有裝好<br>
如JDK、Kotlin...等等<br>
<img src="/images/compose/034.png" alt="Cover" width="50%" /><br />

接著若要在電腦上模擬<br>
則需要創建Android模擬器<br>
點擊最上方系統欄中的`Tools > Device Manager`<br>

<img src="/images/compose/035.png" alt="Cover" width="35%" /><br />

右方會彈出`Device Manager`視窗<br>
<img src="/images/compose/036.png" alt="Cover" width="50%" /><br />

點擊上面的 `+` 並點擊 `Create Vitual Device`<br>
<img src="/images/compose/037.png" alt="Cover" width="50%" /><br />

會彈出視窗讓你選擇你要創建的`Android模擬器`<br>
包括有Phone、Tablet、TV、Watch、Automative等等<br>
那因為Android Studio後期主要由`Google`維護<br>
所以有提供帶有Google Pixel OS的 Android Phone的`AVD(Android Vitual Device)`讓你下載<br>
當然`Pixel AVD的映像檔`也可以在Android Developer官網上下載<br>
不過Google貼心的幫你整合至IDE中了<br>

<img src="/images/compose/038.png" alt="Cover" width="65%" /><br />

選擇想要的Phone並點右下角的`Next`<br>
會進入選擇Android SDK的畫面<br>
這邊也是根據你想要的實測的SDK去選<br>
若是之前沒下載過的SDK<br>
會呈現灰色並且右邊有下載圖示<br>
下載完成後就可以選擇了<br>

點`Next`後可以設定模擬器的設定<br>
如：方向、網路、開機設定、RAM大小、SDK大小等等...<br>
選好後按右下角`Finish`即可<br>
<img src="/images/compose/039.png" alt="Cover" width="65%"/><br/>

<div class="c-border-content-title-1">透過IDE Build Android App</div>
在上方選擇剛創好的模擬器<br>
並點擊上方`Run專案`的按鈕(類似綠色的播放按鈕)讓IDE幫你Build且裝到模擬器中<br>
<img src="/images/compose/040.png" alt="Cover" width="50%"/><br/>

<div class="c-border-main-title-2">手動 Build Android App</div>
<div class="c-border-content-title-1">在terminal中執行以下指令來Build出APK</div>

>  run `./gradlew :yourComposeAppProjectName:assembleDebug`

`yourComposeAppProjectName` 是你創建專案的project name
`assembleDebug` 是指Build debug版的出來

找到 `.apk` file in `yourComposeAppProjectName/build/outputs/apk/debug/yourComposeAppProjectName-debug.apk`

<div class="c-border-content-title-1">手動安裝</div>
有兩種方法<br>
1.把APK拖拉到模擬器中<br>
2.使用指令安裝 (若在`真機`上adb時使用時，需打開開發者模式)<br>

```
adb install ../xxx/yourComposeAppProjectName-debug.apk 
```

<div class="c-border-main-title-2">安裝iOS模擬器</div>

確保Day2 <a href="{{site.baseurl}}/compose-multiplatform-day-2">安裝CMP環境</a>時<br>
安裝了Xcode<br>

在Android Studio畫面最上方有個`Android小綠人`圖示的地方<br>
點開下拉式視窗<br>
這一欄是集成了在專案中設定的`Configuration`<br>
可以是`Build Android app`、`Build iOS app` 或是一些`gradle task`...等等<br>
<img src="/images/compose/041.png" alt="Cover" width="50%"/><br/>

若是第一次在`Android Studio` 中 Run `iOS app`<br>
可能不會有預設的Build iOS Configutraion<br>
所以可以點擊`Edit Configuration`去設定<br>
`點左上角 +` > `iOS Application`<br>
<img src="/images/compose/042.png" alt="Cover" width="50%"/><br/>

隨後可以根據你的需求<br>
a. 設task的名稱<br>
<br>
b. Xcode project file 最右邊點擊folder icon<br>

c. 彈出的檔案選擇器中可以選`.xcodeproj`的路徑<br>
(反藍`.xcodeproj`後點擊open)<br>
<img src="/images/compose/043.png" alt="Cover" width="50%"/><br/>
<br>
d. 選擇.xcodeproj路徑後<br>
IDE會自動讀裡面的 `scheme` 跟 `configuration`<br>
所以接下來我們只要選擇目標的`iOS emulator`版本、型號即可<br>
<img src="/images/compose/044.png" alt="Cover" width="50%"/><br/>
<br>
e. 把Build Configuration改成剛創建的設定<br>
按鈕`Run按鈕`即可<br>

<div class="c-border-content-title-1">透過Xcode Build iOS App</div>
因為CMP是直接在root folder下創建iOS project<br>
所以直接透過Xcode打開CMP專案底下的`iOSApp`資料夾<br>
就可以透過Xcode直接Build iOSApp<br>

<div class="c-border-main-title-2">總結</div>
至此已經可以完整Build CMP專案並在Android 跟iOS模擬器上跑了<br>
<img src="/images/compose/015.png" alt="Cover" width="50%"/><br/>
明天我想跟大家介紹<br>
CMP的專案結構 跟一些可能遇到的疑難雜症<br>




