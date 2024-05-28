---
layout: post
title: Android 用Jektpack Compose 來開發app【03】 - compose導航篇
date: 2024-05-27 15:42:39 +0800
image: cover/
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part3
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 這是這個系列的第三篇<br>
因爲有機會開發整個專案全用Compose來完成的經驗<br>
所以經過一番摸索後<br>
有些心得<br><br>
決定把這個過程寫成筆記分享給大家<br>

<div class="c-border-content-title-1">初期建置</div>
* 使用的library如下：
{% include table/compose-use.html %}

{% include table/compose-category.html %}

<div class="c-border-content-title-4">實作Navigation for Compose</div>
* 這邊預計使用一個Main activity去導航、跳轉到其他畫面<br>
所以今天我們要來實作 Compose中的NavHost

<div class="c-border-content-title-1">step1. 建立各個畫面的enum</div>
* 首先先定義一個enum<br>
裡面會放你預期會需要導航的內容<br>
後續也能隨需求增加而慢慢擴充<br>
<script src="https://gist.github.com/KuanChunChen/78babc3c8b4f6a00e73b65ce472b4dd7.js"></script>


<div class="c-border-content-title-1">step2. 定義Compose Screen</div>
* 針對你需要的畫面去實作，例如：
<script src="https://gist.github.com/KuanChunChen/c40ade08846566ca103aea3b9a5f23f0.js"></script>

<div class="c-border-content-title-1">step3. 建立每個畫面的router</div>
* 因為我們到時候要用到NavGraphBuilder<br>
所以透過擴充NavGraphBuilder來指定每個畫面的router<br>
像這邊就是把剛剛定義好的`Login`當作是他router的一個參考指標<br>
然後為了導航到LoginScreen畫面所以在後面lambda裡面加入該畫面<br>
<script src="https://gist.github.com/KuanChunChen/2577ea435d4b0bb0d028223f6c8dbadd.js"></script>

<div class="c-border-content-title-1">step4. 註冊每個畫面</div>
* 接著把你所有要導航的畫面加入到`NavHost` 內<br>
`startDestination`:是你的開始畫面<br>
`navController`:用來指定跳轉的控制器<br><br>
跳轉畫面只要用navController去控制即可<br>
如：`navController.navigate(ElegantAccessScreen.Feedback.name)`<br>
<script src="https://gist.github.com/KuanChunChen/72c59114a906ceb4efcc48c7acef5762.js"></script>

<div class="c-border-content-title-1">step5. 達成一個activity多screen</div>
* 最終你要新增畫面的時候<br>
只要不斷實作Screen即可<br>
<img src="/images/compose/001.png" width="50%"><br><br>

實際使用：<br>
<script src="https://gist.github.com/KuanChunChen/27b4d20765e035a36eed8ce204cbbc88.js"></script>
