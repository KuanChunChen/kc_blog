---
layout: post
title: "[Android][Kotlin][JetpackCompose]基礎篇(3) - JetpackCompose SwipeRefresh 輕鬆讓list刷新！"
date: 2021-10-28 14:41:12 +0800
image: cover/ea_swiperefresh_app.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
---

<br>
延續上一篇文章：<br>

<a href="{{site.baseurl}}/2021/09/28/android-kt-jetpack-compose-list/">
  <img src="/images/cover/ea_swiperefresh_app.png" alt="Cover" width="20%" >
</a>

<a align="right" href="{{site.baseurl}}/2021/09/28/android-kt-jetpack-compose-list/">[Android][Kotlin][JetpackCompose]基礎篇(2) - JetpackCompose LazyColumn + Jetpack Viewmodel 輕鬆做出list列表還能動態更新資料！</a><br>

今天會繼續完整基於Jetpack Compose LazyColumn的下拉刷新功能<br>


<h2>實作效果：下拉列表刷新</h2>
<div align="center">
  <img src="/mov/jetpack/ea_swiperefresh_app.gif" width="30%"/>
</div>


而這裡主要用到 <br>
* JetpackCompose SwipeRefresh, LazyColumn
* Viewmodel

這篇其實會很簡單完成<br>
主要就是透過前幾篇的概念合起來<br>
再套用一個SwipeRefresh的compose就能完成目標<br>

<script src="https://gist.github.com/KuanChunChen/fe87780cc0639b8458d764ce30ee54ed.js"></script><br>

這邊解說下各個變數的意義<br>
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
