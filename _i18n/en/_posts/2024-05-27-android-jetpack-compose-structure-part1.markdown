---
layout: post
title: Android 用Jektpack Compose 來開發app【01】 - 初期建構篇
date: 2024-05-27 14:07:32 +0800
image: cover/android-jetpack-compose-structure-part1.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part1
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 距離上一次發`Jetpack compose`相關的文章已是<br>
2~3年前<br><br>
其間斷斷續續會稍微碰到<br>
不過都沒有好好的系統性的去研究<br><br>
剛好近期<br>
有機會開發整個專案全用Compose來完成的經驗<br>
所以經過一番摸索後<br>
有些心得<br><br>
決定把這個過程寫成筆記分享給大家<br>


<div class="c-border-content-title-1">專案建置</div>

* 首先會先決定這次要用的library是哪些<br>
這次選用為官方最新推薦的來做挑戰<br><br>

* 其中某些library 也是最新版本AS創建new project會套用的<br>
像是`material3`、`kts+toml的配置`、`jetpack compose`等等<br>
另外，之前有分享過`toml`遷移時會遇到的問題<br>
有興趣可以<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">參考看看</a><br><br>

* 實際的規劃如下：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">實作Compose主題</div>

* 以前在使用xml時，會透過加入色碼到colors.xml<br>
再把color resource ID 放到styles.xml去達成黑暗模式的主題配置<br><br>
現在用了`compose`就可以透過`.kt`來配置該app的主題<br>
根據每個專案需求不同可自行配置<br>
我個人習慣先根據`UX/UX設計稿`去設定的`ColorScheme`、`shpae`、`typo`、`statusBarColor`、`navigationBarColor`...等等<br>
而不是一頁一頁個別去設計<br>
這樣可以節省很多重複開發的時間<br>


<div class="c-border-content-title-1">step1. 加入compose相關lib以及material3</div>
<script src="https://gist.github.com/KuanChunChen/416e5be6bcc5a0a6221d0fd027a503cb.js"></script>
這邊就依照需求自行導入<br>
實際使用toml是用這種寫法：`implementation(libs.androidx.material3)`<br>
放在你的`build.gradle.kts(:app)`中<br><br>
 * `tips`: 上面這邊的多個library在導入androidx-compose-bom時支援自動mapping對應library的版本，所以這邊就不一定需要輸入version.ref<br>
<div class="c-border-content-title-1">step2. 配置通用的Theme包含color、shpae、typo</div>

這邊有關於Material 3 theme的
<a class="link" href="https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md" data-scroll>文檔</a>

<script src="https://gist.github.com/KuanChunChen/7daaa21db73354b5ea4c6f7a9adefc1e.js"></script>
<script src="https://gist.github.com/KuanChunChen/6315bd0157777d118f0def22f2f7e288.js"></script>

<div class="c-border-content-title-1">step3. 實際使用theme</div>
這邊分別是設定狀態列、導航欄、theme等等<br>
colorscheme就是套用前面實作的
<script src="https://gist.github.com/KuanChunChen/a94e4b1cde86b6b8789bdd1e89d526ca.js"></script>
在Activity或Screen中使用：<br>
<script src="https://gist.github.com/KuanChunChen/eef8ce349264ca797f6644676a588ffa.js"></script>

<div class="c-border-content-title-1">(Optional) step4. 製作通用toolbar</div>
* 這邊則是做一個通用的toolbar<br>
因為通常由ui/ux設計師出圖的話<br>
多數時候toolbar會是相近的效果呈現<br>
我自己就會先根據設計稿把toolbar寫好通用的<br>
這邊就看大家需不需要做這步<br>
如下：<br>
<script src="https://gist.github.com/KuanChunChen/448372236d5ae5dd508b69a3c5e350ac.js"></script>
這邊是實際使用`MainAppBarConfig`<br>
主要是要在MainAppBarConfig裡面	加入想要的樣式或點擊反應<br>
接著放到`Scaffold`內的`topBar`就可以了
<script src="https://gist.github.com/KuanChunChen/0d011cba78589066d77d921d2e029a5e.js"></script>
<div class="c-border-content-title-4">結語</div>
* 第一部分就到這邊了<br>
主要是先把前面的基礎建設打穩<br>
後面開發就會很方便、有效率了!<br><br>
<a class="link" href="#category" data-scroll>跳回目錄</a>
