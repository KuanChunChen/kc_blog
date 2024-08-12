---
layout: post
title: Android 用Jektpack Compose 來開発app【01】 - 初期構築篇
date: 2024-05-27 14:07:32 +0800
image: cover/android-jetpack-compose-structure-part1.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part1
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前書き</div>
* 前回`Jetpack compose`に関する記事を投稿してから<br>
2〜3年が経ちました<br><br>
その間、断続的に少し触れていましたが<br>
体系的に研究することはありませんでした<br><br>
ちょうど最近<br>
プロジェクト全体をComposeで開発する機会がありました<br>
そのため、いろいろと試行錯誤した結果<br>
いくつかの心得があります<br><br>
この過程をメモとして皆さんと共有することにしました<br>


<div class="c-border-content-title-1">プロジェクトの構築</div>

* まず、今回使用するライブラリを決定します<br>
今回は公式の最新の推奨ライブラリを使用して挑戦します<br><br>

* その中のいくつかのライブラリは、最新バージョンのASで新しいプロジェクトを作成する際にも適用されます<br>
例えば`material3`、`kts+tomlの設定`、`jetpack compose`などです<br>
また、以前に`toml`移行時に遭遇する問題について共有したことがあります<br>
興味がある方は<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">参考にしてください</a><br><br>

* 実際の計画は以下の通りです：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Composeテーマの実装</div>

* 以前はxmlを使用して、colors.xmlに色コードを追加し<br>
color resource IDをstyles.xmlに配置してダークモードのテーマ設定を行っていました<br><br>
現在は`compose`を使用して`.kt`でアプリのテーマを設定できます<br>
各プロジェクトのニーズに応じて自由に設定できます<br>
私は個人的に`UX/UXデザイン稿`に基づいて`ColorScheme`、`shape`、`typography`、`statusBarColor`、`navigationBarColor`などを設定するのが好きです<br>
一ページずつ個別に設計するのではなく<br>
これにより、重複した開発時間を大幅に節約できます<br>


<div class="c-border-content-title-1">step1. compose関連libおよびmaterial3の追加</div>
<script src="https://gist.github.com/KuanChunChen/416e5be6bcc5a0a6221d0fd027a503cb.js"></script>
ここではニーズに応じて導入します<br>
実際にtomlを使用する場合は次のように記述します：`implementation(libs.androidx.material3)`<br>
これを`build.gradle.kts(:app)`に配置します<br><br>
 * `tips`: 上記の複数のライブラリはandroidx-compose-bomを導入する際に対応するライブラリのバージョンを自動的にマッピングするため、version.refを入力する必要はありません<br>
<div class="c-border-content-title-1">step2. 共通のテーマ（color、shape、typography）の設定</div>

こちらはMaterial 3テーマに関する
<a class="link" href="https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md" data-scroll>ドキュメント</a>

<script src="https://gist.github.com/KuanChunChen/7daaa21db73354b5ea4c6f7a9adefc1e.js"></script>
<script src="https://gist.github.com/KuanChunChen/6315bd0157777d118f0def22f2f7e288.js"></script>

<div class="c-border-content-title-1">step3. 実際にテーマを使用する</div>
ここではステータスバー、ナビゲーションバー、テーマなどの設定を行います<br>
colorschemeは前述の実装を適用します
<script src="https://gist.github.com/KuanChunChen/a94e4b1cde86b6b8789bdd1e89d526ca.js"></script>
ActivityやScreenで使用する場合：<br>
<script src="https://gist.github.com/KuanChunChen/eef8ce349264ca797f6644676a588ffa.js"></script>

<div class="c-border-content-title-1">(オプション) step4. 汎用ツールバーを作成する</div>
* ここでは汎用のツールバーを作成します<br>
通常、UI/UXデザイナーがデザインを提供する場合<br>
多くの場合、ツールバーは似たような効果を持つことが多いです<br>
私はデザインに基づいて汎用のツールバーを先に作成します<br>
このステップが必要かどうかは皆さん次第です<br>
以下のように：<br>
<script src="https://gist.github.com/KuanChunChen/448372236d5ae5dd508b69a3c5e350ac.js"></script>
ここでは実際に`MainAppBarConfig`を使用します<br>
主にMainAppBarConfigに必要なスタイルやクリック反応を追加し<br>
それを`Scaffold`内の`topBar`に配置するだけです
<script src="https://gist.github.com/KuanChunChen/0d011cba78589066d77d921d2e029a5e.js"></script>
<div class="c-border-content-title-4">結語</div>
* 第一部はここまでです<br>
主に前述の基礎をしっかりと固めることが目的です<br>
後の開発が非常に便利で効率的になります!<br><br>
<a class="link" href="#category" data-scroll>目次に戻る</a>
