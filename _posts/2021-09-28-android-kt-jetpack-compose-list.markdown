---
layout: post
title: "[Android][Kotlin][JetpackCompose]基礎篇(2) - JetpackCompose LazyColumn + Jetpack Viewmodel 輕鬆做出list列表還能動態更新資料！"
date: 2021-09-28 11:03:41 +0800
image: cover/ea-website-lazy-colume-cover-photo.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
---
<br>
根據android官方的發展<br>
推薦使用從listview -> recyclerview -> 新的listadapter出現<br>
現在進化到jetpack compose也能做出列表囉～<br>
所以又多了一種做列表的選擇<br>
我實作後<br>
發現挺簡單<br>
分享給大家參考<br>
主要的難點就是把viewmodel串近Jetpack compose的code裏面<br>
<br>

<h2>實作效果：list列表與動態變更資料</h2>
<div align="center">
  <img src="/mov/jetpack/ea_list_app.gif" width="30%"/>
</div>

<br>

而這裡主要用到 <br>
* JetpackCompose
* Viewmodel



<h2>第一步：做出list的item</h2>
這步跟以往用recycler view 做xml很像<br>
也是先實作每個item想要長的模樣<br>
因為前面幾篇有講過類似概念<br>
所以不再贅述<br>
有興趣想了解可以回去看前面的文章<br>

<div align="start">
  <a href="{{site.baseurl}}/2021/09/13/android-kt-jetpack-compose-base/">
    <img src="/images/cover/ea-website-base-cover-photo.png" alt="Cover" width="20%" >
  </a>
  <a align="right" href="{{site.baseurl}}/2021/09/13/android-kt-jetpack-compose-base/">[Android][Kotlin][JetpackCompose]基礎篇(0) - JetpackCompose view元件範例</a><br><br>

  <a href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash/">
    <img src="/images/cover/ea-website-splash-cover-photo.png" alt="Cover" width="20%" >
  </a>

  <a align="right" href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash/">[Android][Kotlin][JetpackCompose]基礎篇(1) - JetpackCompose 做出帶動畫的splash頁面</a><br>


</div>

<br>
直接看實作item範例 ：<br>
<br>

<script src="https://gist.github.com/KuanChunChen/90340f7ddf11897d221d12b87bab4782.js"></script>
<br>
主要就是實作item <br>
可以搭配你自定義的data model、navigate引導等等 <br>
然後配置好你各個元件要在的位置<br>
以及套入資料
<br>

<h2>第二步：使用LazyColumn去實現list列表</h2>

再來只要使用LazyColumn呼叫你剛剛做好的item<br>
這樣就能實作一個list列表了<br>
如下：
<script src="https://gist.github.com/KuanChunChen/691f335e74c0ba919d159065ce9d70de.js"></script>



<h2>第三步：加入viewmodel去變化資料</h2>

這邊是我這篇實作的viewmodel<br>
使用了jetpack的viewmodel<br>
以及livedata去觀察資料的變化<br>
<script src="https://gist.github.com/KuanChunChen/3fd3912e5202073418e05e8c5057fac3.js"></script>
<br>
<br>

<font color="green">提示(hint) </font>

```
常常在code看到用底線_命名變數
例如上面這個例子就是
_devices 與 devices
但卻不懂為何要用這樣同名的變數只加一個底線
或取成不同名字的兩個變數
這是我之前剛開始寫code會有的疑問
後來我終於明白
所以這邊來分享下
```

其實意義就是在一個是private<br>
主要用來給這個class內去操作<br>
其他要操作的就是用public的變數去呼叫<br>
如這個上面這個例子來說<br>
_devices就是用來給class內部呼叫 要變的話只用內部的fun去操作<br>
或者像是這邊套了livedata<br>
讓其他開放的public變數去觀察或者取用 如本例devices<br>
並藉由getter / setter 讓外部呼叫可以直接更改<br>
而不會動到主要的那個變數<br>

<br>
<br>
把剛剛前面實作的list相關與viewmodel包成content:<br>
<script src="https://gist.github.com/KuanChunChen/6bae5c6238ec34c9c01b35a5f1144259.js"></script>
<br>
<br>
這邊主要加入這行<br>
使得jetpack viewmodel變成實際要用在view上的data<br>

```kotlin
val devices: List<BleDevice> by deviceViewModel.devices.observeAsState(listOf())
```

這是我最後包成一個content的範例，供參考：<br>
<script src="https://gist.github.com/KuanChunChen/b544ff8031746459060be65333bb222b.js"></script><br>



<h2>第四步：加進fragment看看吧</h2>
<br>
記得導入viewmodel<br>

```kotlin
val model: DeviceViewModel by activityViewModels()
```

之後帶帶入剛剛完成的content內<br>
看範例：<br>

<script src="https://gist.github.com/KuanChunChen/93bf9336cded4dd003e6aa5f7b54d18b.js"></script>

所以之後要只要觀察到viewmodel內livedata有變化後<br>
畫面就會自動更新了<br>
真的挺方便啊！<br>
