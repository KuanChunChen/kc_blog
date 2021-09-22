---
layout: post
title: "[Android][Kotlin][JetpackCompose]基礎篇(1) - JetpackCompose 做出帶動畫的splash頁面"
date: 2021-09-17 15:02:11 +0800
image: cover/jetpackComposeCover.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
---


今天一樣帶大家來寫新的jetpack compose<br>
那這篇目標會是做出一個<br>
簡單的splash 頁面<br>
現在很多app都會做一個進版畫面<br>
讓用戶清楚知道現在的app是什麼<br>
或標示出公司等<br>
讓用戶清楚知道自己正在用什麼app <br>

所以<br>
我們今天最後達成的目標會是這樣：<br>
<br>

<div align="center">
  <img src="/mov/jetpack/ea_splash_app.gif" width="30%"/>
</div>


<h4>前言</h4>
<br>
一個簡單的跳轉 + 簡單水平擴展的動畫<br>
就能完成今天的目標<br>
那這篇會以完成這個目標為主<br>
有些jetpack compose基礎不了解的話<br>
可以參考這一篇:<br>

<br>
<div align="start">
  <a href="{{site.baseurl}}/2021/09/13/android-kt-jetpack-compose-base/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/2021/09/13/android-kt-jetpack-compose-base/">[Android][Kotlin][JetpackCompose]基礎篇(0) - JetpackCompose view元件範例</a>
</div>

這篇開始時，已經假設會了基本的compsable的概念了，所以還沒了解的可以參考上面那篇。

----
<h4>第一步： 想好頁面架構</h4>

這邊我習慣先想好我的view最後長相會是怎樣<br>
所以我先套了一層box去當某個圖層的概念<br>
之後我要這個區塊<br>
就能跟其他部分做區別<br>

<script src="https://gist.github.com/KuanChunChen/4862edcea54d85e0b3afec37c02f78fa.js"></script>

<h4>第二步 ： 實作 splash頁logo動畫</h4>

這裡傳入function type <font color="red"> event:()->Unit = {} </font><br>
讓我之後能觸發某個外層呼叫想要執行的動作<br>
並預設要執行進場跟退場動畫多久<br>
以及delay多久執行傳入的動作<br>
當然也可以把這些變數拉到fun內變數去做<br>
這邊為了讓大家方便理解所以就先寫在fun內<br>

<script src="https://gist.github.com/KuanChunChen/b61eb400f593a0bd389d1b129f7dc9c5.js"></script><br>

根據情況加入colume<br>
因為我希望我的logo是在正中間偏上方一點<br>
所以加入colume用modify去調整相關位置<br>
參數可參考下方code <font color="red">#23~#34行</font><br>
<br>
<script src="https://gist.github.com/KuanChunChen/65f06da7ebceb4e93d08b6fe1aad7629.js"></script>

<h4><font color="red">本文重頭戲</font></h4>

這裡要開始來做動畫了<br>
使用到了jetpack compose的 AnimatedVisibility<br>
這個類提供了很多內建方法<br>
讓我們能快速做出一些基本的動畫<br>


這裡要先看到我們前面寫了一個val變數state<br>
這是在jetpack compose內滿常用到的一個概念<br>
是因為現在單用composable寫code<br>
不會現在xml裏面自動更新<br>
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



接著就是開始做動畫了<br>
這邊一樣使用jetpack compose的lib去做<br>
用了AnimatedVisibility<br>
這裡直接呼叫提供了變數讓你輸入去用這個function<br>
這邊我們用了這幾個<br><br>
1.visibleState<br>
2.enter<br>
3.exit<br>

visibleState就是這個動畫出現的狀態<br>
所以配合前面remember的MutableTransitionState<br>
可以觸發這個lib<br>
也就是說當該狀態改變後<br>
這個function就會再執行<br>
<br>
然後enter跟exit分別為<br>
入場與出場動畫<br>
這邊比較好理解<br>

這邊就可以用官方提供的幾種方法套入內建動畫<br>



進場使用 expandHorizontally：<br>

<div align=center style="word-wrap: break-word;">

<img src="https://developer.android.com/images/jetpack/compose/animation-expandhorizontally.gif" alt="" width="100" class="screenshot">
<br>
<a href="https://developer.android.com/jetpack/compose/animation#entertransition"><font color="#999999" size= "1">本圖片轉自google android developer</font></a>


</div>
<br>

出場使用 fadeOut：<br>

<div align=center style="word-wrap: break-word;">
<img src="https://developer.android.com/images/jetpack/compose/animation-fadeout.gif" alt="" width="100" class="screenshot">
<br>
<a href="https://developer.android.com/jetpack/compose/animation#entertransition"><font color="#999999" size= "1">本圖片轉自google android developer</font></a>

</div>

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

之後再在funtion type範圍內（AnimatedVisibilityScope）<br>
去加入你要顯示的物件就可以跑出動畫了<br>
最後成品如下：



<script src="https://gist.github.com/KuanChunChen/5953666a7808fbdfb4de564d07a6314e.js"></script>
