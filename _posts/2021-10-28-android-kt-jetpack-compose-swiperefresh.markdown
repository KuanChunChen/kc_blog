---
layout: post
title: "Android Jetpack Compose SwipeRefresh：輕鬆實現列表的下拉刷新功能！"
date: 2021-10-28 14:41:12 +0800
image: cover/ea_swiperefresh_app-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-swiperefresh
excerpt: "這篇文章介紹了如何使用 Jetpack Compose 中的 LazyColumn 和 SwipeRefresh運用，以輕鬆實現動態更新的列表資料。"
---

<div class="c-border-main-title-2">前言</div>
延續上一篇文章：<br>

<a href="{{site.baseurl}}/android-kt-jetpack-compose-list/">
  <img src="/images/cover/ea_swiperefresh_app.png" alt="Cover" width="20%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-list/">Jetpack Compose：使用 LazyColumn + ViewModel 輕鬆實現動態更新的列表資料</a><br>

今天會繼續完整基於Jetpack Compose LazyColumn的下拉刷新功能<br>

<div class="c-border-main-title-2">實作效果：下拉列表刷新</div>

<div align="center">
  <img src="/mov/jetpack/ea_swiperefresh_app.gif" width="30%"/>
</div>


<div class="c-border-content-title-4">用到相關知識</div>
* JetpackCompose SwipeRefresh, LazyColumn
* Viewmodel

只需要結合之前所介紹的概念，<br>
再應用 Jetpack Compose 中的 SwipeRefresh 元件，<br>
就能輕鬆實現目標功能。<br>

透過這個教學，<br>
你將學習如何運用先前所學，<br>
並將 SwipeRefresh 結合到你的應用程式中。<br>
這個過程非常直觀，<br>
只需要幾個簡單的步驟，<br>
你就可以為你的列表加入下拉刷新的功能。<br>


<script src="https://gist.github.com/KuanChunChen/fe87780cc0639b8458d764ce30ee54ed.js"></script><br>

<div class="c-border-content-title-4">各變數的意義</div>

state就是觀察是否下拉刷新的boolean<br>

onRefresh就是讓你帶入要做事情的scope<br>

indicator可以讓你下拉刷新時下來轉圈圈那個符號的細項設定<br>
其中程式碼是這樣<br>
```
indicator = { state, trigger ->
            SwipeRefreshIndicator(
                state = state,
                refreshTriggerDistance = trigger,
                contentColor = Color.Black,
                arrowEnabled = true,
                fade = true,
                scale = true,
                backgroundColor = MaterialTheme.colors.primary,
            )
}
```
其他的話依照上面命名名稱<br>
可以設定一些 大小、背景色、箭頭是否出現、箭頭顏色、刷新距離等等<br>

除此之外<br>
另外一個重點是<br>
swiperefresh的state<br>
會根據你的狀態判斷是否顯示轉圈圈動畫<br>
所以當狀態為true時<br>
轉圈圈那個等待動畫就會存在<br>
當改為false時<br>
這邊我是用livedata然後obsere as state<br>
然後觀察刷新完取得資料才<br>
讓他設定結束<br>

那其實這個下拉刷新<br>
簡單就完成了<br>
你也可以趕快試試！<br>
