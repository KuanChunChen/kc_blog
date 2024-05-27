---
layout: post
title: Android 用Jektpack Compose 來開發app【02】 - DI注入篇
date: 2024-05-27 15:27:05 +0800
image: cover/
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 這是這個系列的第二篇<br>
因爲有機會開發整個專案全用Compose來完成的經驗<br>
所以經過一番摸索後<br>
有些心得<br><br>
決定把這個過程寫成筆記分享給大家<br>

<div class="c-border-content-title-1">初期建置</div>
* 使用的library如下：
{% include table/compose-use.html %}

<div class="c-border-content-title-4">導入DI注入 - Hilt</div>
<div class="c-border-content-title-1">step1. 導入Hilt & KSP</div>
* 為了使用Hilt 所以需要配置以下的toml<br>
主要是hilt library跟 導入hilt會用到ksp<br>
<script src="https://gist.github.com/KuanChunChen/a529e6aef2c4cb054a593689b86ab962.js"></script>

* 在build.gradle.kts(:app)中 加入plugin
<script src="https://gist.github.com/KuanChunChen/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* 在build.gradle.kts(:yourAppName)中導入：
<script src="https://gist.github.com/KuanChunChen/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* 在build.gradle.kts(:app)中導入：
<script src="https://gist.github.com/KuanChunChen/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. 實作Hilt application</div>
* 官方文件有提到<br>
加入Hilt一定要包含	`@HiltAndroidApp`<br>
所以實作一個Application<br>
<script src="https://gist.github.com/KuanChunChen/648bd2e1d642c5ea108af87e7700a7de.js"></script>

實測若沒加，會報錯如下：<br>
`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. 可以開始注入class了</div>
* 當上面配置好之後<br>
hilt會在class頭有加入`@AndroidEntryPoint`的提供inject的功能<br>

* 那就來試試吧做一個使用Hilt的Viewmodel
<script src="https://gist.github.com/KuanChunChen/c76e7ce4bc7743832372ae66ae651f03.js"></script>

實際使用：
<script src="https://gist.github.com/KuanChunChen/412d3db62610456139c5231632f5d2dd.js"></script>

