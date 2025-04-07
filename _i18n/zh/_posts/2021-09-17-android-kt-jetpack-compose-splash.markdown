---
layout: post
title: "來學習Jetpack Compose 在splash頁面加入動畫吧！"
date: 2021-09-17 15:02:11 +0800
image: cover/ea-website-splash-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-splash
excerpt: "透過Jetpack Compose，你可以輕鬆地為你的應用程式添加動態、生動的啟動頁面。
在這篇文章中，我們將帶你一步步學習如何使用Jetpack Compose創建動畫頁面"

---

<div class="c-border-main-title-2">目標</div>
這篇目標會是做出一個<br>
簡單的splash 頁面<br>
我們今天最後達成的目標會是這樣：<br>
<br>

<div align="center">
  <img src="/mov/jetpack/ea_splash_app.gif" width="60%"/>
</div><br>

<div class="c-border-main-title-2">前言</div>
現在許多應用程式都會設計一個進入畫面，<br>
以便讓用戶清楚地識別當前的應用程式或公司標誌，<br>
確保用戶知道他們正在使用的是哪個應用程式。<br>

在本篇文章中，<br>
我們將重點介紹如何實現一個簡單的跳轉功能，<br>
並配合簡單的水平擴展動畫，<br>
來達到今天的目標。<br>
如果你對Jetpack Compose的基礎還不熟悉，<br>
可以參考這篇文章以加深理解：<br>
<br>
<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="20%" >
  </a>

  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">Android Jetpack Compose 基本應用教學</a>
</div>


<div class="c-border-content-title-4">這篇開始時，已經假設會基本概念了，所以還沒了解的可以參考上面那篇。</div>

----
<div class="c-border-content-title-4">第一步：想好頁面架構</div>
首先，<br>
我們需要先考慮這個頁面的整體結構。<br>
通常習慣先想像最終畫面的樣子，<br>
因此我透過使用一個Box元件作為不同圖層的概念來區分各個區塊。<br>

<script src="https://gist.github.com/waitzShigoto/4862edcea54d85e0b3afec37c02f78fa.js"></script>

<div class="c-border-content-title-4">第二步 ： 實作 splash頁logo動畫</div>
在這一步中，我們將傳入一個函式型別的參數 <font color="red"> event:()->Unit = {} </font><br>
這樣我們就能在之後觸發某個外部呼叫所要執行的動作。<br>
同時，<br>
我們也可以預設動畫的進場與退場時間，<br>
以及執行傳入動作前的延遲時間。<br>
這些參數可以根據需求自行調整，<br>
但為了方便理解，我們先將它們寫在函式內部。<br>

<script src="https://gist.github.com/waitzShigoto/b61eb400f593a0bd389d1b129f7dc9c5.js"></script><br>
根據具體情況，<br>
我希望我的 Logo 在頁面正中央並稍微偏上一點，<br>
所以我加入了 Column 元件，並使用 Modifier 調整相關位置。<br>
你可以參考下方程式碼的<font color="red">#23~#34行</font>，來調整相關位置。<br>

<br>
<script src="https://gist.github.com/waitzShigoto/65f06da7ebceb4e93d08b6fe1aad7629.js"></script>

<div class="c-border-content-title-4">第三步 ： 本文重頭戲</div>

現在我們將進入動畫的關鍵部分，<br>
使用了 Jetpack Compose 的 AnimatedVisibility。<br>
這個類提供了許多內建的方法，<br>
讓我們能夠快速實現一些基本的動畫效果。<br>

在這一部分，<br>
我們先來看一下前面我們定義的一個 val 變數 state。<br>
這是 Jetpack Compose 中經常使用的概念之一，<br>
因為在單獨使用 Composable 寫程式碼時，<br>
它不會自動在 XML 中進行更新。<br>

<font color="red">要透過state告知composable更新</font><br>

```Kotlin
val state = remember {

    MutableTransitionState(false).apply {
        ...
    }
}
```

所以這邊用到 <font color="red">remember</font> 來記住（儲存） MutableTransitionState 物件<br>

這邊重點講一下 MutableTransitionState<br>
它是一種包含了兩種狀態的 可觀察其狀態的項目<br>
其中包含 <font color="red">currentState</font> 與 <font color="red">targetState</font><br>

根據官方解釋 <br>
當可觀察的state狀態改變時<br>
會觸發系統讓compose去重組<br>
所以我們可以利用這個特性<br>
去實時變更我們compose元件的內容<br>


例如我這邊的例子是：<br>
1.先宣告一個staus 初始狀態為 false<br>
2.在使用AnimatedVisibility設定該visibleState為我剛剛宣告的staus<br>
3.回到剛剛宣吿val staus的地方加入apply<br>
<br>
其中概念是<br>
利用了kotlin extension 概念apply去執行scope內的code<br>
因apply可以取得父類內的特性<br>
所以設定MutableTransitionState內的targetState變為ture<br>
<font color="red">此舉動會讓MutableTransitionState發生改變<br></font>
所以使用該staus的會觸發上方說過的特性<br>
讓我們開發時有依據去判斷何時要改變compose<br>

```kotlin
val state = remember {

        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            ...

        }
    }
```

也就是說，<br>
使用上面方法觸發動畫<br>
觸發後同時觸發Handler去執行跳轉的動作：<br>

```kotlin
val state = remember {
        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            Handler(Looper.getMainLooper()).postDelayed({
                event.invoke()
            }, delayMillis)

        }
    }
```
<br>


接下來，<br>
我們將開始進行動畫的製作。<br>
在這裡，<br>
我們同樣使用了 Jetpack Compose 的庫，<br>
具體來說是使用了 AnimatedVisibility。<br>

在這個函式中，我們使用了以下幾個變數：<br>
1.visibleState：這是控制動畫顯示狀態的變數。<br>
透過前面提到的 remember 和 MutableTransitionState，<br>
我們能夠觸發這個庫的動畫效果。<br><br>
換句話說，當該狀態改變時，這個函式就會再次執行。<br>
2.enter：這個變數用於定義動畫進場的效果。<br><br>
3.exit：這個變數用於定義動畫退場的效果。<br>
<br>
透過設定這些變數，<br>
我們能夠控制動畫的出現與消失，<br>
從而營造出令人驚艷的視覺效果。<br><br>


理解上面後，就可以用官方提供的幾種內建動畫套入<br>


進場使用 `expandHorizontally`<br>
出場使用 `fadeOut`<br>


也就是說在 enter與exit分別帶入要的動畫如下：<br>
```kotlin
AnimatedVisibility(
          visibleState = state,
          enter = expandHorizontally(
              animationSpec = tween(
                  durationMillis = startDurationMillis,
                  easing = LinearEasing
              ),
          ),
          exit = fadeOut(
              animationSpec = tween(
                  durationMillis = exitDurationMillis,
                  easing = LinearEasing
              ),
          )
      ){
        ...
      }
```

接著，<br>
在 AnimatedVisibilityScope 的函式型別範圍內，<br>
你可以加入你想要顯示的元件，<br>
這樣就能呈現出動畫效果了。<br>
<div class="c-border-main-title-2">最終成品，範例程式碼</div>
<script src="https://gist.github.com/waitzShigoto/5953666a7808fbdfb4de564d07a6314e.js"></script>
