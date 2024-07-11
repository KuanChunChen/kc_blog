---
layout: post
title: "【Compose Multiplatform 】跨平台App但Android需要context作法並搭配Koin"
date: 2024-07-10 16:44:11 +0800
image: cover/compose_multiplatform_di_context.png
tags: [Kotlin, Compose Multiplatform, Dependency Injection, Koin]
permalink: /compose-multiplatform-di-context
categories: ComposeMultiplatform
excerpt: "本文詳細介紹了在 Compose Multiplatform 專案中，如何在使用 Koin 進行依賴注入時處理 Android 平台特有的 Context 問題，並提供了實際的代碼實現。"
---

<div class="c-border-main-title-2">前言</div>

在開發 Compose Multiplatform 專案時<br>
我們需要處理平台特定的問題<br>
其中會遇到一個問題是<br>
Android 平台需要 Context 而 iOS 不需要<br>
本文將介紹如何在使用 Koin 進行依賴注入時<br>
成功的解決這個問題<br>

<div class="c-border-main-title-2">實作方法</div>
<div class="c-border-content-title-1">1. 使用 expect 和 actual 關鍵字</div>
首先<br>
我們需要使用 CMP 的 expect 和 actual 關鍵字來為不同平台提供不同的實現<br><br>

這邊先在commonMain建立expect<br>
我這個例子是因為SettingDataStore需要context<br>
而LearningViewModel需要SettingDataStore<br>
所以建立一個expect platformModule的變數<br>
<script src="https://gist.github.com/KuanChunChen/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-content-title-1">2. 在 Android 平台實現</div>
在 Android 平台中，我們需要實現platformModule <br>
那我預期dataStore需要拿到個context：<br>
<script src="https://gist.github.com/KuanChunChen/683e5aae4fed38732e316cb0a94cde94.js"></script>

<div class="c-border-content-title-1">3. 在 iOS 平台實現</div>
在 iOS 平台中，我們不需要 Context<br>
所以直接實作就可以<br>
<script src="https://gist.github.com/KuanChunChen/912bd0f442f650156791481b1cf7e4c3.js"></script>

<div class="c-border-content-title-1">4. 初始化 Koin</div>
在各平台的啟動點初始化 Koin：<br><br>

Android<br>
在Android的啟動點去取得context<br>
並塞進startKoin的module list裡面<br>
<script src="https://gist.github.com/KuanChunChen/34ee8c8baf10fe2ab0a34a0d3815994a.js"></script>

iOS:<br>
<script src="https://gist.github.com/KuanChunChen/425c93b104dcc5cc35373a83174dfe1d.js"></script>

<div class="c-border-main-title-2">使用方法</div>
在 commonMain 中使用koinViewModel注入的 ViewModel：<br>
<script src="https://gist.github.com/KuanChunChen/0d756e78444510d20f26fec3a8829358.js"></script>

或是在module就把需要的instance用`get()`去幫你產生也可以
<script src="https://gist.github.com/KuanChunChen/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-main-title-2">總結</div>
- 使用 expect 和 actual 關鍵字可以處理平台差異
- Koin 在 Compose Multiplatform 中提供了 DI 支持
- 正確處理 Context 可以讓跨平台代碼更加清晰和可維護
- 這種方法可以應用於其他平台特定的依賴注入場景
- 在實際開發中，可再根據大家自己的需求靈活調整 DI 策略