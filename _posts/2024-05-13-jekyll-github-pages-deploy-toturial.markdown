---
layout: post
title: "【部署教學】Github pages 遷移至Jekyll 4.x以上版本-2024.5月適用"
date: 2024-05-13 14:21:13 +0800
image: cover/kotlin_room-1.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Kotlin
excerpt: "在這篇實戰教學中，我們將深入探討如何在 Android 應用程式中使用 Kotlin 與 Room 來實現持久化存儲。無論你是初學者還是有經驗的開發者，這篇教學都將為你提供實用的知識和技巧，讓你能夠更有效地開發 Android 應用程式。讓我們一起探索 Kotlin 與 Room 資料庫的強大功能，並將它們完美地融入到你的下一個 Android 項目中吧!"
---

<div class="c-border-main-title-2">前言</div>
我最近對網站的版面配置進行了一些修改<br>
並且想在 CSS 中使用 rgb() 函數<br>
但我發現在 Jekyll 3.9.x 版本中無法使用這個功能<br>
這讓我不得不將 Jekyll 版本升級到 4.x 以上<br><br>

升級後我感到相當興奮<br>
在本地運行 bundle exec jekyll serve 進行測試<br>
一切似乎都運行得很好<br><br>

然而當我將更改推送到 GitHub 儲存庫後<br>
我遇到了一些麻煩<br>
在部署到 GitHub Pages 時出現了錯誤訊息<br>
`GitHub Pages: github-pages v231 GitHub Pages: jekyll v3.9.5 `
<img src="/images/jekyll_deploy/001.png" alt="jekyll deploy 4.x" /><br>
原來問題出在 GitHub Pages 的配置上<br>
這導致我無法通過預設配置直接成功部署更新<br>

考慮到 GitHub Pages 是一個免費且有使用限制的服務<br>
它`預設`不支援較新版本的 Jekyll 也在情理之中<br>
因此我只好自己手動進行調整<br>
下面是我嘗試多次失敗後<br>
終於build success的筆記<br>
分享給大家<br>

<div class="c-border-main-title-2">部署步驟</div>
<div class="c-border-content-title-1">1. 調整部署方式</div><br>
首先進入你部署的repo<br>
並進入setting頁<br>
<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" /><br><br><br><br>

接著依序點擊Code and automation下的Pages
在`Source`下選擇GitHub Actions <br>
<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" /><br>


<div class="c-border-content-title-1">2. 設置ruby版本</div>

在build jekyll專案時會需要用到ruby<br>
安裝ruby後系統內就會有一個預設版本

在你build jekyll<br>
沒設定指定ruby版本時<br>
jekyll就會使用你預設系統的版本<br>

所以用此指令來檢查你的版本
<script src="https://gist.github.com/KuanChunChen/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

我們要放到github部署並且使用jekyll 4.x版本<br>
所以需要ruby 3.2.3版<br>
(不確定其他版本能不能，其他有興趣的夥伴可以去測測看)<br>
如果沒有的3.2.3話可以用一些工具去安裝<br><br>

不過這邊因為我電腦剛好是裝了rbenv<br>
所以指令以此為例<br><br>

<script src="https://gist.github.com/KuanChunChen/e02a03b088c850d4c4bb6802295d7704.js"></script>
當然你也可以用其他常用cmd tool<br>
如：RVM、chruby 或 asdf<br>
依照各位自己的習慣去安裝就行~<br>

最後你需要在你的jekyll專案的根目錄底下<br>
建立一個檔案 `.ruby-version`<br><br>

可以用類似下面指令直接做<br>
<script src="https://gist.github.com/KuanChunChen/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

或是你想直接手動創建也是可以<br>
<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" /><br><br><br><br>

<div class="c-border-content-title-1">3. Build jekyll專案</div>
