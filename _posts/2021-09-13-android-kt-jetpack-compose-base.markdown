---
layout: post
title: "Android Jetpack Compose 基本應用教學"
date: 2021-09-13 16:00:48 +0800
image: cover/ea-website-base-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-base
excerpt: "歡迎來到 Android Jetpack Compose 基本應用教學！在本教學中，我們將帶你進入 Jetpack Compose 的世界，透過一步步的指導，讓你掌握 Compose 的基本概念和技巧。"

---

<div class="c-border-main-title-2">前言</div>
在2021/7/28的時候<br>
google官方終於發佈了Jetpack Compose 穩定版1.0了 <br>
有興趣看官網發布文的可以看 <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">這裡</a> <br>

<br>
那今天這篇我打算來分享一些基本的如何用jetpack compose來做一些元件用在android app上面
<br>
<br>
Jetpack Compose是一種完全用kotlin程式碼 <br>
去取代原本用.xml檔寫的view或layout <br>
寫出來只會有.kt檔案 <br>
減少了大部分的xml檔。 <br>

<div class="c-border-content-title-4">Jetpack compose 裡面用了大量kotlin中獨有的特色</div><br>

<div class="table_container">
  <p>Kotlin 一些基本概念</p>
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">Lambda expression</a></li>
    <li><a href="javascript:void(0)">Function type</a></li>
    <li><a href="javascript:void(0)">Extension</a></li>
    <li><a href="javascript:void(0)">Named argument</a></li>
  </ol>
</div>

<br>
所以如果先前對上述kotlin概念已經很熟悉了<br>
對學習Jetpack Compose就有很大優勢<br>
幾乎沒多久就能上手。<br>



<div class="c-border-content-title-4">首先我們先看看兩者的差異</div>

像是這是使用 xml 寫一個簡單toolbar的方式：<br>
<script src="https://gist.github.com/KuanChunChen/46bbdced14c9e3c26023854bed33c60d.js"></script><br>

而這則是用jetpack compose來寫toolbar<br>

<script src="https://gist.github.com/KuanChunChen/80743e79901a8c98b87655ff8f020193.js"></script><br>


這樣的改變使得我們能夠完全用程式碼來控制視圖（view）。<br>
同時，<br>
也讓使用一些函式型別（function type）的變數更加方便，<br>
以便控制視圖實現所需的功能。<br>
由於使用純Kotlin程式碼來實作，<br>
我們能夠更靈活地使用判斷式來控制視圖的顯示與否。<br>
這使得我們在設計應用程式時具有更大的彈性。<br>

<div class="c-border-main-title-2">具體做法</div>

在此，<br>
我們建立了一些基礎的小部件（widget）。<br>
當你實際上要在 Activity 或 Fragment 中使用時，<br>
你可以根據需求進行重複使用，<br>
這樣能更有效地開發和管理你的應用程式。<br>
這種模組化的設計方式讓你能夠快速構建功能豐富且可重複使用的界面元素，<br>
大大節省開發時間並提高代碼的可維護性。<br>

<br>
最後做出來在IDE預覽可能會長成這樣<br>
左邊寫code右邊是預覽畫面<br>

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>


<div class="c-border-content-title-4">前期準備工作</div>

必需更新android studio到Arctic Fox版本<br>
才能透過IDE預覽Composable元件<br>

官方下載位置：
<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">下载 Android Studio Arctic Fox</a>
<br>
<br>

<div class="c-border-content-title-4">第一步</div>
先加入相關lib 至 gradle dependencies內 :<br>
<script src="https://gist.github.com/KuanChunChen/c18119da90591482e2f6f5b6cb67bdec.js"></script>
<br>
<br>
<br>

<div class="c-border-content-title-4">第二步</div>
加入@Composable用以來說明你的這個fun是jetpack compose的元件<br>
<script src="https://gist.github.com/KuanChunChen/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>
<br>
<br>
<br>
那這裡的

```
Modifier
```
這是一個在 Jetpack Compose 中常常使用的介面，<br>
用於擴充元件的屬性。<br>
在這裡，<br>
使用變數作為函式參數的形式，<br>
意味著當你呼叫 AppBar 元件時，<br>
你可以自定義 Modifier，<br>
設定該元件的背景色、動畫、字體等等屬性。<br>

<h6>(根據你所使用的官方元件的不同，依照該元件的 Modifier 實現方式來設定不同的內容。) </h6>
<br>

<div class="c-border-content-title-4"><font color="green">選擇性(optional) </font></div>

你可以使用 Column 來對你使用 Jetpack Compose 建立的視圖進行排序。<br>
Column 提供了一種類似於 LinearLayout 的垂直排列方式，<br>
當你需要添加多個元件時非常實用。<br>
通過使用 Column，你可以輕鬆將多個元件垂直排列在一起，<br>
使你的界面佈局更加結構化和易於管理。<br>
<script src="https://gist.github.com/KuanChunChen/203f5c350db588cc6b3730f9b326710c.js"></script>
---


開始加入官方lib內建的funtion 直接快速做出一個toolbar<br>
例如 TopAppBar<br>
<script src="https://gist.github.com/KuanChunChen/66d842982f99a753c786594e918abe16.js"></script>

那這邊你會看到一些<br>

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```

<br>
其實就是利用 kt內特性  Named argument 跟 function type 等<br>
讓你在用fun時更能有效的去擴充程式碼<br>

另外，這邊我們就可以利用funtion type變數<font color="red">
content: @Composable RowScope.() -> Unit</font>
去加入一個Image 在TopAppBar左邊：<br>

(這邊你可以按cmd+左鍵 去看TopAppBar的源碼知道RowScope在幹嘛)


<script src="https://gist.github.com/KuanChunChen/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

<br>
到這邊就快速完成一個易擴充、能重複用的簡單widget了..
<br>

<div class="c-border-content-title-4">第三步</div>
那要開始預覽的話要怎麼用呢？
你只要再寫一個fun並加入 @Preview
再按下refresh就能看到IDE右邊會顯示你剛剛做的view了
(如果沒看到可以點 右邊Design 或 split來打開預覽畫面)

<script src="https://gist.github.com/KuanChunChen/eac588083154d8faf5c8f15fff868798.js"></script>
<br>
<div class="c-border-content-title-4">第四步</div>
那實際應用上<br>
你可以再包成一個content讓你去呼叫<br>
這樣你的畫面就能分得很細<br>
未來再維護上會更有效率<br>
<br>

像是這樣來包一個完整邏輯的layout<br>
這樣你未來要改layout長相就能從這裡改<br>
你的基本元件有的一些功能就不用特別修改<br>
<script src="https://gist.github.com/KuanChunChen/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

實際做出來：
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>
<br>
<div class="c-border-content-title-4">最後一步</div>

完成上面的步驟<br>
你就可以在fragment或activity裡設定你的layout了<br>
相當簡潔<br>
<script src="https://gist.github.com/KuanChunChen/d697201a60570da069cd3cc4f0ce425c.js"></script>
