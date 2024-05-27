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

<div class="c-border-content-title-4">實作Navigation for Compose</div>
* 因後面流行使用一個Main activity去導航、跳轉到其他畫面<br>
所以今天我們要來實作 Compose中的NavHost

<div class="c-border-content-title-1">step1. 建立各個畫面的enum</div>
* 首先先定義一個enum<br>
裡面會放你預期會需要導航的內容<br>
後續也能隨需求增加而慢慢擴充<br>
<script src="https://gist.github.com/KuanChunChen/78babc3c8b4f6a00e73b65ce472b4dd7.js"></script>