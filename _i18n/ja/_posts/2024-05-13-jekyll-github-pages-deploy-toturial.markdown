---
layout: post
title: "【デプロイ手順】Github PagesをJekyll 4.x以上のバージョンに移行する方法 - 2024年5月適用"
date: 2024-05-13 14:21:13 +0800
image: cover/jekyll_github_deploy.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Jekyll部署
excerpt: "この記事では、Github PagesサイトをJekyll 4.x以上のバージョンに移行するための詳細なガイドを提供しています。各設定ステップを網羅し、Jekyllの最新バージョンの強力な機能をスムーズにアップグレードして享受できるようにしています。"
---

<div class="c-border-main-title-2">前言</div>
私最近ウェブサイトのレイアウトを少し変更しました<br>
そしてCSSでrgb()関数を使用したいと思いました<br>
しかし、Jekyll 3.9.xバージョンではこの機能を使用できないことがわかりました<br>
これにより、Jekyllのバージョンを4.x以上にアップグレードせざるを得ませんでした<br><br>

アップグレード後、非常に興奮しました<br>
ローカルで `bundle exec jekyll serve` を実行してテストしました<br>
すべてがうまく動作しているように見えました<br><br>

しかし、変更をGitHubリポジトリにプッシュした後<br>
いくつかの問題に直面しました<br>
GitHub Pagesにデプロイする際にエラーメッセージが表示されました<br>
`GitHub Pages: github-pages v231 GitHub Pages: jekyll v3.9.5 `
<img src="/images/jekyll_deploy/001.png" alt="jekyll deploy 4.x" /><br>
問題はGitHub Pagesの設定にありました<br>
これにより、デフォルトの設定では更新を正常にデプロイできませんでした<br>

GitHub Pagesは無料で使用制限があるサービスであることを考えると<br>
それが`デフォルト`で最新バージョンのJekyllをサポートしていないのも理解できます<br>
したがって、自分で手動で調整するしかありませんでした<br>
以下は何度も失敗した後の<br>
<img src="/images/jekyll_deploy/007.png" alt="jekyll deploy 4.x" /><br>
ついにビルドに成功したメモです<br>
皆さんと共有します<br>

<div class="c-border-main-title-2">部署步驟</div>
<div class="c-border-content-title-1">1. 調整部署方式</div><br>
まず、デプロイするリポジトリに入ります<br>
そして設定ページに入ります<br>
<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" /><br><br><br><br>

次に、Code and automationの下のPagesを順にクリックします
`Source`でGitHub Actionsを選択します <br><br>
<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" /><br><br>

その後、自分の環境を設定し始めます...<br>

<div class="c-border-content-title-1">2. 設置ruby版本</div>

Jekyllプロジェクトをビルドする際にはrubyが必要です<br>
rubyをインストールすると、システムにデフォルトバージョンが設定されます<br>

Jekyllをビルドする際に<br>
rubyバージョンを指定しない場合<br>
Jekyllはデフォルトのシステムバージョンを使用します<br>

このコマンドを使用してバージョンを確認します
<script src="https://gist.github.com/waitzShigoto/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

GitHubにデプロイしてJekyll 4.xバージョンを使用するためには<br>
ruby 3.2.3バージョンが必要です<br>
3.2.3がない場合は、いくつかのツールを使用してインストールできます<br><br>

ここでは、私のコンピュータにrbenvがインストールされているので<br>
rbenvを例にします<br>

<script src="https://gist.github.com/waitzShigoto/e02a03b088c850d4c4bb6802295d7704.js"></script>
もちろん、他の一般的なコマンドツールも使用できます<br>
例：RVM、chruby、またはasdf<br>
各自の習慣に応じてrubyを調整、インストールしてください~<br>

最後に、Jekyllプロジェクトのルートディレクトリの下に<br>
`.ruby-version`ファイルを作成する必要があります<br><br>

類似の指令を使って直接行うことができます<br>
<script src="https://gist.github.com/waitzShigoto/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

または手動で作成することもできます<br>
<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" /><br><br><br><br>
ファイルの内容はバージョン番号です<br>
<img src="/images/jekyll_deploy/005.png" alt="jekyll deploy 4.x" /><br><br>

<div class="c-border-content-title-1">3. Jekyllプロジェクトのビルド</div>

rubyのインストールが完了したら、Jekyllプロジェクトの設定を始めます<br>
まず、`Gemfile`に以下の設定を行います<br>
ruby 3.2.3版を導入します <br>
`ruby "3.2.3"`<br>
次に使用するJekyllのバージョンを設定します<br>
`gem "jekyll", "~> 4.3.3"`<br>
必要な指令は以下の通りです：<br>
<script src="https://gist.github.com/waitzShigoto/b64bfac8864bd597792c65ec75b9f099.js"></script><br>

完全な設定は以下の通りです<br>
参考にしてください<br>
私が使用しているいくつかのJekyllプラグインも含まれています<br>
必要に応じて追加してください<br>
<script src="https://gist.github.com/waitzShigoto/67631c36472fc3781800e847033d5250.js"></script>

次に、Jekyllのルートディレクトリで以下を実行します<br>
<script src="https://gist.github.com/waitzShigoto/f860bebfabda529bd7bb3d21e51467ae.js"></script>
これは`Gemfile.lock`ファイルを生成し、プロジェクトが正常に実行できるようにするためです<br><br>

生成後、以下を使用して<br>
`bundle exec jekyll serve`でテストし、正常に動作するか確認します<br>
成功すると以下のメッセージが表示されます<br>
<img src="/images/jekyll_deploy/006.png" alt="jekyll deploy 4.x" /><br><br><br><br>

<div class="c-border-content-title-1">4. GitHub CIファイルの設定</div>

最後に、<br>
GitHubの自動デプロイ設定ファイルを設定する必要があります。<br><br>

通常、`.yml`を使用して設定します。<br>
こちらが公式推奨のJekyll初期設定です：<a href="https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml
">公式推奨</a><br><br>

公式推奨の`.yml`ファイルの数行を変更するだけです：<br>
- ターゲットブランチを調整します：<br>
  `branches: ["master"]`<br>
- 使用するRubyを指定します：<br>
  `uses: ruby/setup-ruby@v1`<br>
- Rubyのバージョン：<br>
  `ruby-version: '3.2.3'`<br><br>

以下が最終的な完全な`.yml`設定です<br>
そのまま使用して修正することができます<br>
<script src="https://gist.github.com/waitzShigoto/4f7e0968d7028a9c23e5749db9cc91e8.js"></script><br>

<div class="c-border-main-title-2">まとめ</div>
実際の手順は非常に簡単です<br>
ruby環境、Jekyll、GitHub環境を設定するだけです<br><br>
最終的に`git push remote branch`でパッチをプッシュすれば<br>
GitHub Actionsがウェブサイトをビルドしてくれます<br>
そしてデプロイ設定を追加すれば、自動的にGitHub Pagesにデプロイされます<br>
ただし、デプロイ設定は公式のサンプルに既に含まれています<br>
変更が必要なのはrubyの環境とターゲットブランチだけです~<br><br>

成功しました
<img src="/images/jekyll_deploy/008.png" alt="jekyll deploy 4.x" />
