---
layout: post
title: "【Compose Multiplatform】手機本地持久化儲存DataStore實作"
date: 2024-07-10 13:10:10 +0800
image: cover/compose_multiplatform_datastore.png
tags: [Kotlin, Compose Multiplatform, DataStore]
permalink: /compose-multiplatform-datastore
categories: ComposeMultiplatform
excerpt: "本文介紹了如何在 Compose Multiplatform 專案中實現跨平台的 DataStore 本地化儲存，包括導入庫、實作各平台 DataStore 以及在 commonMain 中使用 DataStore 的方法。"
---

<div class="c-border-main-title-2">前言</div>

在純 Android 專案中<br>
我們可以直接使用原生的 DataStore<br>
但在 Compose Multiplatform 專案中<br>
如何繼續無痛使用 DataStore 呢？<br>
本文將介紹如何在跨平台環境中<br>
實現 DataStore 的本地化儲存<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">實作步驟</div>
<div class="c-border-content-title-1">1. 導入庫</div>
在 .toml 文件中添加：<br>
<script src="https://gist.github.com/KuanChunChen/64fbb0e57e0aae819f214a001a2ad618.js"></script>

在 build.gradle.kts 中添加：<br>
<script src="https://gist.github.com/KuanChunChen/072a8d5fb78c251d75bff786043e7b4e.js"></script>

<div class="c-border-content-title-1">2. 實作各平台 DataStore</div>
創建 expect 函數和本地化儲存名稱：<br>
<script src="https://gist.github.com/KuanChunChen/8296380fb742aa1610f47e03ddc9c9ad.js"></script>

Android 平台實作：<br>
<script src="https://gist.github.com/KuanChunChen/614b088bdf6023183b0dee650b5649ee.js"></script>

iOS 平台實作：<br>
<script src="https://gist.github.com/KuanChunChen/d0e2b82e2d755d318e328aaa8e0d226d.js"></script>

<div class="c-border-content-title-1">3. 在 commonMain 中使用 DataStore</div>
把上面實作的接口拿來用
就可以在 commonMain 中使用 DataStore 了：<br>
<script src="https://gist.github.com/KuanChunChen/aad753fa1e7571946cee9a1fb768e4ff.js"></script>

<div class="c-border-content-title-1">4. 加入 Koin module（Optional）</div>
如果想要使用 Koin 進行依賴注入，可以這樣設置：<br>
<script src="https://gist.github.com/KuanChunChen/cec17b93139a5431fdf2ca437f71de02.js"></script>

<div class="c-border-main-title-2">總結</div>
- Compose Multiplatform 允許我們在跨平台項目中使用 DataStore
- 通過適當的封裝，可以在不同平台上統一使用 DataStore API
- 使用 DataStore 可以簡化本地數據持久化的實現
- 結合 Koin 等依賴注入框架，可以更好地管理 DataStore 實例

<div class="c-border-main-title-2">參考資料</div>
[Android Developer 官方](https://developer.android.com/kotlin/multiplatform/datastore)