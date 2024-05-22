---
layout: post
title: "【部署教學】Github pages 遷移至Jekyll 4.x以上版本-2024.5月適用"
date: 2024-05-13 14:21:13 +0800
image: cover/jekyll_github_deploy.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Jekyll部署
excerpt: "本文提供了一個詳細的指南，幫助您將您的 Github pages 網站遷移至 Jekyll 4.x 以上版本。涵蓋了各個配置的每個步驟，確保您能夠順利升級並享受 Jekyll 最新版本的強大功能。"
---

<div class="c-border-main-title-2">前言</div>
我最近對網站的版面配置進行了一些修改<br>
並且想在 CSS 中使用 rgb() 函數<br>
但我發現在 Jekyll 3.9.x 版本中無法使用這個功能<br>
這讓我不得不將 Jekyll 版本升級到 4.x 以上<br><br>

升級後我感到相當興奮<br>
在本地運行 `bundle exec jekyll serve` 進行測試<br>
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
<img src="/images/jekyll_deploy/007.png" alt="jekyll deploy 4.x" /><br>
終於build success的筆記<br>
分享給大家<br>

<div class="c-border-main-title-2">部署步驟</div>
<div class="c-border-content-title-1">1. 調整部署方式</div><br>
首先進入你部署的repo<br>
並進入setting頁<br>
<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" /><br><br><br><br>

接著依序點擊Code and automation下的Pages
在`Source`下選擇GitHub Actions <br><br>
<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" /><br><br>

之後就要開始配置自己的環境了...<br>

<div class="c-border-content-title-1">2. 設置ruby版本</div>

在build jekyll專案時會需要用到ruby<br>
安裝ruby後系統內就會有一個預設版本<br>

在你build jekyll<br>
沒指定ruby版本時<br>
jekyll就會使用你預設系統的版本<br>

所以用此指令來檢查你的版本
<script src="https://gist.github.com/KuanChunChen/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

我們要放到github部署並且使用jekyll 4.x版本<br>
所以需要ruby 3.2.3版<br>
如果沒有的3.2.3話可以用一些工具去安裝<br><br>

不過這邊因為我電腦剛好是裝了rbenv<br>
所以我就以此rbenv為例<br>

<script src="https://gist.github.com/KuanChunChen/e02a03b088c850d4c4bb6802295d7704.js"></script>
當然你也可以用其他常用cmd tool<br>
如：RVM、chruby 或 asdf<br>
依照各位自己的習慣去調整、安裝ruby就行~<br>

最後你需要在你的jekyll專案的根目錄底下<br>
建立一個檔案 `.ruby-version`<br><br>

可以用類似下面指令直接做<br>
<script src="https://gist.github.com/KuanChunChen/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

或是你想直接手動創建也是可以<br>
<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" /><br><br><br><br>
檔案內容就是版本號碼<br>
<img src="/images/jekyll_deploy/005.png" alt="jekyll deploy 4.x" /><br><br>

<div class="c-border-content-title-1">3. Build jekyll專案</div>

ruby安裝完後開始來配置jekyll專案<br>
首先要在你的`Gemfile`裡面進行下面設置<br>
要導入ruby 3.2.3版 <br>
`ruby "3.2.3"`<br>
然後設置要使用的jekyll版本<br>
`gem "jekyll", "~> 4.3.3"`<br>
需求指令如下：<br>
<script src="https://gist.github.com/KuanChunChen/b64bfac8864bd597792c65ec75b9f099.js"></script><br>

完整的配置如下<br>
供大家參考<br>
包含我使用的一些jekyll插件<br>
如果有用到再加就好<br>
<script src="https://gist.github.com/KuanChunChen/67631c36472fc3781800e847033d5250.js"></script>

再來在你的jekyll跟目錄底下執行<br>
<script src="https://gist.github.com/KuanChunChen/f860bebfabda529bd7bb3d21e51467ae.js"></script>
目的是要幫你產生`Gemfile.lock`檔案<br>
並讓你的專案可以順利執行<br><br>

產生後可以用<br>
`bundle exec jekyll serve` 進行測試看看是否運行成功<br>
成功顯示下面訊息<br>
<img src="/images/jekyll_deploy/006.png" alt="jekyll deploy 4.x" /><br><br><br><br>

<div class="c-border-content-title-1">4. 配置github CI檔案</div>

最後，<br>
我們需要設置 GitHub 的自動部署配置文件。<br><br>

通常使用 `.yml` 進行配置。<br>
這裡是官方推薦的 Jekyll 初始配置：<a href="https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml
">官方推薦</a><br><br>

我們所需做的只是修改官方推薦的 `.yml` 文件中的幾行：<br>
- 調整目標分支：<br>
  `branches: ["master"]`<br>
- 指定當前使用的 Ruby：<br>
  `uses: ruby/setup-ruby@v1`<br>
- Ruby 版本：<br>
  `ruby-version: '3.2.3'`<br><br>

以下是我最終的完整 `.yml` 配置<br>
您可以直接使用並進行修改<br>
<script src="https://gist.github.com/KuanChunChen/4f7e0968d7028a9c23e5749db9cc91e8.js"></script><br>

<div class="c-border-main-title-2">總結</div>
其實步驟很簡單<br>
就是需要把從ruby環境、jekyll、github 環境都設定好<br><br>
最終再用`git push remote branch`把你的patch push上去<br>
就可以觸發github action幫你build網站了<br>
然後加上deploy的設定就會自動幫你部署到github pages上了<br>
不過deploy的設定在官方提供的範例已經有了<br>
你需要改動的地方只有ruby的環境跟目標branch而已~<br><br>

成功了
<img src="/images/jekyll_deploy/008.png" alt="jekyll deploy 4.x" />
