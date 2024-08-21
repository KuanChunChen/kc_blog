---
layout: post
title: "Compose Multiplatform 實戰：續戰，用Wizard創建CMP專案"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-3
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>


`Compose Multiplatform (簡稱CMP)`<br>
昨天我們才剛完成安裝CMP的環境<br>

如果以寫程式的角度來看<br>
其實任何檔案或結構<br>
妳都可以完全從零開始自己<br>
每個檔案都自己創建<br>
甚至用指令去寫也可<br>
例如<br>
`touch xxx.kt`<br>
然後`vim` 去改每個檔案<br>

但這樣太麻煩了<br>
所以我們在創建專案<br>
通常會用一些已經幫你配置好的專案結構<br>

像是以CMP來講<br>
我們就可以用官方提供的`Wizard`來創建<br>

所以今天我們就來暸解下<br>
怎麼透過`Wizard`創建CMP的專案<br>
以及一些疑難雜症<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">CMP專案創建</div>
<div class="c-border-content-title-1">創建專案</div>
其實很簡單<br>
透過JetBrain官方的網頁<br> 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

進到該網頁後<br>
你會看到如下畫面<br>
![Wizard](https://ithelp.ithome.com.tw/upload/images/20240803/20168335CtPWaT7Hi9.png)

並依照你自己的需求去修改專案的名稱、包名..等等<br>

以下是根據上圖 把一些設定快速帶一下：<br>

`Project Name`：是針對你這個專案設定名稱<br>
主要會影響你`Build app出來的名稱`<br>
專案的`root folder名稱`<br>

`Project ID` : 也就是你Build App出來的Package Name<br>
也會影響你的專案的package 的路徑<br>

另外下面會看到幾個勾選框<br>
`Android`、`iOS`、`Desktop`、`Web`、`Server`<br>
你可以`根據你的需求`去勾選想要網頁幫你配置專案的基本項目<br>

這邊簡單易懂<br>
例如我這次目標是 `Android`、`iOS` 那我就勾選這兩個平台<br>
那在iOS下方會看到 兩個選項<br>
主要是讓你選擇要用哪個UI配置<br>
> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

如果你要讓iOS 也使用Compose 做選擇<br>
`Share UI (with Compose Multiplatform UI framework)`<br>
反之則是使用Native 的SwiftUI<br>

不過上面的他只是根據你的設定去`預設`而已<br>
如果你要調整`後續還是可以手動改`<br><br>

完成後就點擊Download<br>
可以得到一個幫你創建好的專案<br>
![CMPP](https://ithelp.ithome.com.tw/upload/images/20240803/20168335ycbaz969VV.png)

-----

#### 導入到IDE中

解壓縮上一步驟得到的`Zip壓縮檔`<br>
之後就可以透過`Android Studio`中的 `import project`<br>
把它導入到IDE<br>
讓他能在IDE中做編輯<br>

找到`File > New > import project`<br>
![Import project](https://ithelp.ithome.com.tw/upload/images/20240803/20168335iskk1sqkm5.png)

在彈出的檔案選擇器中<br>
選擇剛剛解壓縮的`資料夾`即可<br>
![CMPWizard](https://ithelp.ithome.com.tw/upload/images/20240803/20168335Z04fXsCa1b.png)

-----

## 額外加碼分享【Compose Multiplatform Wizard】<br>
前面幾天有說過CMP相關的社群目前都滿活躍的<br>
或是主要在開發的公司`JetBrains`<br>
目前都有持續在維護或更新<br>
這個是比較新的feature也是由`JetBrains員工`開發的<br>
[Compose Multiplatform Wizard](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)
不過沒有放到官方文件中<br>
這是我無意間逛github看到的<br>

跟上面的`Kotlin Multiplatform Wizard` 其實是類似的東西<br>
`Compose Multiplatform Wizard`其用途也是他也是透過網頁幫你產生以`Compose`為UI的專案<br>
然後多了一些可以幫你導入CMP常用library的選項<br>

![https://ithelp.ithome.com.tw/upload/images/20240805/20168335gsN9GpkWL7.png](https://ithelp.ithome.com.tw/upload/images/20240805/20168335gsN9GpkWL7.png)

跟上面一樣<br>
輸入想要的Project Name 跟Project ID<br>
選擇想要的Library後<br>
點擊下載後再解壓縮導入IDE中<br><br>

另外這是該大神`terrakok`的github repo 有興趣可看<br>
看起來他是用github page架設的<br>
[Compose-Multiplatform-Wizard github](https://github.com/terrakok/Compose-Multiplatform-Wizard-App)

