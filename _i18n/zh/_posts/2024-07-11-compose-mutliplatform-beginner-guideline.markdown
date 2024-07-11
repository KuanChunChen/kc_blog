---
layout: post
title: "【Compose Multiplatform】專案轉移探討與開發指南"
date: 2024-07-11 18:30:20 +0800
image: cover/compose_multiplatform_guide.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-guide
categories: ComposeMultiplatform
excerpt: "本文詳細介紹了從 Compose 專案轉移到 Compose Multiplatform 的過程，包括前期轉移成本、常用庫的對應關係、可能遇到的問題以及未來展望。"
---

<div class="c-border-main-title-2">前言</div>

Compose Multiplatform (CMP) 為開發者提供了跨平台開發的強大工具<br>
但從 Compose 專案轉移到 CMP 也面臨一些挑戰<br>
本文將詳細介紹轉移過程中的關鍵點和注意事項<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">前期轉移成本</div>

CMP 開發時需要熟悉多個資料夾的結構：<br>
<img src="/images/compose/009.png" alt="Cover" width="30%"/><br>

共通代碼放在 commonMain 中：<br>
<img src="/images/compose/010.png" alt="Cover" width="30%"/><br>

在各環境下導入需要的庫：<br>
<img src="/images/compose/011.png" alt="Cover" width="50%"/><br>

因預設使用lib.version.toml來配置 <br>
需了解.toml<br>
這邊有以前寫的筆記<br>
<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">可參考</a>

<div class="c-border-main-title-2">Compose Project 到 CMP Project 庫的轉移參考</div><br>
* 假設我們原本製作Android專案都是用一些較常用的lib、或是官方推薦的(如表格左邊)<br>
  嘗試用CMP寫之後我們使用的lib 轉移成本會嚐到一些紅利(如表格右邊)<br>
  因為大多是你寫compose會用過的東西<br>
{% include table/compose-multiplatform-compare.html %}

<div class="c-border-main-title-2">可能遇到的問題</div>

1. 跨平台需求差異：<br>
   例如 Android 需要 Context，iOS 不需要：<br>
   <script src="https://gist.github.com/KuanChunChen/d4594b6b1b1e92509fa34c67233b301d.js"></script><br>
   完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform 】跨平台App但Android需要context作法並搭配Koin</a>
2. 平台特定實現：<br>
   像是手機端常用本地持久化儲存 <br>
   在Android會使用dataStore去處理這個相關問題<br>
   那要怎麼在多平台去使用呢？<br>
   使用 expect 和 actual 關鍵字：<br>
   <script src="https://gist.github.com/KuanChunChen/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/KuanChunChen/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/KuanChunChen/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   不過儘管需要各自實作<br>
   但一些常用的library<br>
   CMP有支援以kotlin實作的library<br>
   所以就算分平台實作還是可以用純.kt去寫 <br>
   就像是上面的iosMain中實作的dataStore一樣<br><br>

   完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】手機本地持久化儲存DataStore實作</a>

3. CMP庫的兼容性問題或Bug持續修正中：<br>
   例如 SqlDelight 2.0.0 版本在 iOS 上的Build會錯誤：<br>
    - 解決方法 1：導入 stately-common<br>
    - 解決方法 2：升級到 2.0.1 以上版本<br>
   其原因可以查看此討論串：[點此](https://github.com/cashapp/sqldelight/issues/4357)<br>
   SqlDelight完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】手機資料庫SqlDelight實作</a>
<div class="c-border-main-title-2">未來展望</div>

Google 在 2024 年 5 月 14 日的博客中提到了對 KMP 的支持：<br>
<img src="/images/compose/012.png" alt="Cover" width="50%"/><br>
這可能意味著未來會有更多庫得到支持。

<div class="c-border-main-title-2">總結</div>

- CMP 提供了強大的跨平台開發能力，但需要適應新的專案結構
- 大部分常用庫都有對應的 CMP 版本
- 處理平台差異時，使用 expect 和 actual 關鍵字很有幫助
- 注意庫的版本兼容性問題
- 關注 Google 和社區的最新動態，以獲得更多支持和資源