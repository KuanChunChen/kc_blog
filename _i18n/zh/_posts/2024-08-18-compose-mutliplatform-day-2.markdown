---
layout: post
title: "Compose Multiplatform 實戰：初戰，安裝CMP環境吧。"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-2
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>

`Compose Multiplatform (簡稱CMP)` UI框架能將Kotlin程式碼共用能力推向新高度<br>
你可以一次實作使用者介面<br>
並在所有目標平台上使用——包括iOS、Android、桌面和Web<br>
今天我們將開始一步一步安裝環境<br><br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">目標</div>
我們要建立一個CMP專案能製作出`多平台`(Android、iOS、Web、Desktop) 的應用程式<br>
所以要先了解怎麼樣建立一個CMP的專案<br><br>

你們可以根據下面列出項目安裝<br>
其中有部分是選擇性<br>
大家可以依據`自己的需求`去做安裝<br>

* Android Studio
* Java and JDK
* Xcode
* Kotlin plugins
* (Optional) Kotlin Multiplatform plugin
* (Optional) CocoaPods
* (Optional) kdoctor
* (Optional) Browsers

<div class="c-border-main-title-2">CMP環境安裝 - 安裝必要工具</div>

## 推薦先安裝`kdoctor` (Optional)<br>
這個是官方推薦的一個插件<br>
他可以幫你檢查環境內的必要項目是否已經就緒<br>


在Terminal中使用指令去安裝kdoctor<br>
```
brew install kdoctor
```
![brew install](https://ithelp.ithome.com.tw/upload/images/20240802/20168335bDI4GRADR0.png)

接著直接用`kdoctor` 就能檢查了<br>
像是我環境中<br>
沒安裝Kotlin Multiplatform Plugin<br>
他也能幫你檢查出來<br>

```
kdoctor
```
![kdoctor](https://ithelp.ithome.com.tw/upload/images/20240802/20168335yncSdrrQFZ.png)

總而言之<br>
只要看到都`[v]`<br>
代表你的`環境正確`了<br>

如果kdoctor在檢查你的環境時診斷出任何問題：<br><br>

`[x]`：需要修復的任何失敗的檢查<br>
你可以在*符號後找到問題描述和潛在解決方案。<br>

`[!]`：檢查警告<br>
可能會是不一定要安裝的<br>
只是提醒你可以安裝之類的<br>

-----
## 安裝Android Studio

為了製作CMP更方便我們需要安裝`Android Studio`<br>

先至[Android Studio 官網](https://developer.android.com/studio?hl=zh-tw)<br>
下載IDE<br>
![IDE](https://ithelp.ithome.com.tw/upload/images/20240802/20168335x0265RznRn.png)
接著就如果是`MacOS`是把下載好的`.dmg` 點開<br>
把IDE拖移到Application資料夾<br>
如果是`Windows` 就是`.exe` 選擇目錄去安裝<br>

![install](https://ithelp.ithome.com.tw/upload/images/20240802/20168335HKBEeRJXeb.png)
(圖為Mac的安裝示意圖)



-----
## 檢查Kotlin Plugin

CMP主要是使用`Kotlin`來開發<br>
所以Kotlin Plugin這也`必需`安裝<br>
不過因為現在Android Studio都幫你整合好<br>
你一安裝好 他就幫你裝好Kotlin Plugin<br>
(比較新的IDE版本都會幫你裝好)<br>

所以可以接著打開`Android Studio`<br>

不過如果真的遇到問題<br>
可以去`Tool > Kotlin > Configt Kotlin in Project`<br>
讓IDE幫你檢查是否安裝<br>
![Check](https://ithelp.ithome.com.tw/upload/images/20240802/20168335PqtTLB2Tjd.png)



-----
## 檢查Java JDK環境

其實這個步驟跟上面一樣<br>
比較新的Android Studio IDE也都幫你安裝好了<br><br>

如果`不確定`有沒有安裝的話<br>
IDE也有內建的可以下載<br>
可以到下面這個地方找看看有沒有安裝JDK<br>
點擊`Android Studio > Setting` 或 快捷鍵 `Command + ,`<br>
![Setting](https://ithelp.ithome.com.tw/upload/images/20240802/20168335v9HHRbfqG8.png)

找到 `Build, Execution Deployment >Build Tools > Gradle`<br>
![JDK Install](https://ithelp.ithome.com.tw/upload/images/20240802/20168335iLQe5dSBuM.png)

點擊下拉式視窗後點擊裡面的看環境內現成的<br>
或是Download JDK去下載<br>
![JDK Download](https://ithelp.ithome.com.tw/upload/images/20240802/20168335hZly2loMGO.png)


另外<br>
這邊我推薦你可以用`sdkman` （Optional）<br>
他可以讓你透過指令`管理你環境中的SDK`<br>
不過因為是`介紹CMP`<br>
所以我就介紹幾個`常用`的指令<br>
大家有興趣可以再去網上找<br><br>

查看目前設定的的sdk<br>
```
sdk current
```

列出可以用跟可下載的Java SDK<br>
```
sdk ls java
```

設定JAVA環境 (xxx的名稱可以透過上面sdk ls 去找)<br>
```
sdk using java xxx
```

-----
## Kotlin Multiplatform plugin (Optional)

為了讓Android Studio更好的支援Multiplatform<br>
我們需要下載`Kotlin Multiplatform plugin`<br>
一樣先打開Setting > Plugin > Marketplace<br>
![KMPP](https://ithelp.ithome.com.tw/upload/images/20240802/20168335hykWOKZr1W.png)

按`install`下載<br>
完成後點`Apply` 然後`Restart`IDE<br>

他可以讓Android Studio透過Create New Project的方式<br>
自動創建`KMP基本的專案內容`<br>
類似幫你創`template`的概念<br>
![CMPP](https://ithelp.ithome.com.tw/upload/images/20240802/201683354CDELzWlX7.png)

> [KMM Plugin官方Release](https://kotlin.liying-cn.net/docs/reference_zh/multiplatform/multiplatform-plugin-releases.html)
有需要可參考

另外`針對CMP`<br>
官方也有提供線上創建CMP基本專案的方式<br>
(忘記KMP跟CMP差異的可以回到`第一天`的文章查看，[點擊查看第一天](https://ithelp.ithome.com.tw/articles/10343147))<br>

就是透過線上的網頁<br>
[Wizard](https://kmp.jetbrains.com/#newProject)<br>
來創建再把他導入到IDE內<br>

就看你要用哪種方式<br>
兩種在開發上的差異大概是<br>
`KMP`：使用`KMM plugin`插件創建，比較聚焦在`Native UI`的 + `common邏輯`的開發方式<br>
`CMP`：使用線上網頁`KMM Wizard`創建後導入IDE，比較聚焦在`Compose UI`+ `common邏輯`開發多平台的方式<br>

這邊就先介紹到這<br>
後面詳細開發專案時<br>
會大概講一下怎麼用`Wizard`<br>




-----
## 安裝 Xcode

如果你是macOS的Mac<br>
並想要運行iOS app<br>
則需要Xcode<br><br>

方法很簡單<br>
就是到App Store 搜尋 Xcode<br>
然後下載<br>
![store](https://ithelp.ithome.com.tw/upload/images/20240802/201683359YHPBTWneL.png)

如果你使用其他操作系統<br>
可以跳過這個步驟<br>
不過可能就沒辦法Build iOS app<br>
感覺上應該也有Worked Around可以解決？<br>
但可能就不是正規的做法XD<br>

-----
## 安裝 CocoaPods (Optional)

如果你預期之後想要用iOS的framework 可以事先安裝<br>
如果不用就等後續需要再安裝也可以<br><br>

使用指令安裝CocoaPods<br>

```
brew install cocoapods
```

不過如果要透過brew安裝<br>
需要用到較高版本的ruby<br><br>

根據官網顯示 至少要用`3.3.4`版本<br>
> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

所以你可以 透過以下指令<br>
去查看環境中的版本<br>

```
ruby -v 
```

版本不到的話<br>
就先`reinstall`<br>
```
brew reinstall ruby
```

最後再用`brew install cocoapods`即可<br>

-----
## 檢查Browser (Optional)

若你要製作Web application<br>
你需要一個支援`Wasm垃圾回收（GC）`功能的瀏覽器。<br>

這是官網提供的資訊<br>
需要確認一下 你OS內`Browser的版本`<br>
是針對`目前有支援的環境` 說明<br>

`Chrome` 和 `Chromium`：從版本 119 開始支援。<br>
`Firefox`：從版本 120 開始支援。<br>
`Safari/WebKit`：Wasm GC 目前正在開發中<br><br>

Safari之類的好像沒有支援<br>
所以不見得可以完整run<br>
如果需要開發Web app的話<br>
可以再根據上面資訊試試<br>

-----
## 結語
-----

我總覺得開始一個新的程式語言 或 框架<br>
通常你會`不太熟悉`怎麼配置他的環境<br>
不過若有人能稍微提點<br>
就能更容易上手<br>

總體來說<br>
不需要之前有Compose Multiplatform、Android或iOS的經驗<br>
從零一步一步開始熟悉Kotlin再到整個CMP也可以慢慢上手<br>

若有任何疑問或問題，歡迎在評論區討論，我們一起學習成長。<br>
這次的內容就到這裡，感謝大家的閱讀和支持！<br>

