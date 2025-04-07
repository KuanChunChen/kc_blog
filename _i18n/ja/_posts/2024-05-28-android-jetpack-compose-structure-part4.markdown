---
layout: post
title: Android 用Jektpack Compose 來開発app【04】 - Compose画面篇
date: 2024-05-28 14:32:37 +0800
image: cover/android-jetpack-compose-structure-part4.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part4
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* これはこのシリーズの第四篇です<br>
この段階では基本的に<br>
UI/UXデザインの画面を描くことが多くなります<br>
皆さんはコードを書くことに集中できます<br>

<div class="c-border-content-title-1">プロジェクト構築</div>
* 使用するライブラリは以下の通りです：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">共通の画面を描く心得共有</div>
* 異なるUI/UXと協力した後<br>
多くのデザイン画面が現在のプロジェクトに共通のコンポーネントを持っていることに気づきました<br><br>
もしプロジェクト全体で共通のコンポーネントがある場合<br>
それを取り出して共通のComposeにすることができます<br>
（主にデザイナーとのコミュニケーション次第です）<br><br>

* よく使われるedittext、dialog、カスタマイズされたコンポーネントなど<br>
以下にいくつか共通コンポーネントとして作成できるComposeを共有します<br>
皆さんは自分のニーズに応じて実装してください<br>

<div class="c-border-content-title-1">Edittext</div>
<img src="/images/compose/002.png" width="100%"><br><br>

<script src="https://gist.github.com/waitzShigoto/1a5a6e77cbaa7565c95152467d9aa6eb.js"></script>


<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/003.png" width="100%"><br><br>

<script src="https://gist.github.com/waitzShigoto/9eb6c6296cfab8ec4e17f5e151f3a205.js"></script>

<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/004.png" width="100%"><br><br>
<script src="https://gist.github.com/waitzShigoto/055ae82beba153468b22473973fc97e8.js"></script>

<div class="c-border-content-title-4">必要な画面を組み立てる</div>
* 次に、さまざまな画面を組み立てることができます<br>
後の新しい要求が同じデザインである場合<br>
前に苦労して分けて描いた画面を簡単に組み立てることができます<br><br>
以下は、前の初期構築篇で共有した共通のツールバーと<br>
上記で共有したComposeを使用した例です
<img src="/images/compose/005.png" width="100%"><br><br>


<div class="c-border-content-title-4">flowを通じて画面更新に対応する</div>

<div class="c-border-content-title-1">flowを作成する</div>

* 現在のアプリ機能はますます多くなっています<br>
そのため、値の取得元や要求も増えています<br><br>
ある機能が複数の画面の変化を処理するように要求された場合<br>
その値の取得元が異なる場合<br>
私はflowを使用して各コルーチンの戻り値を処理します<br><br>
ソースデータのreturnや型をすべてflowにします<br>
データソースのアクセス速度を制御できない場合もあります<br>
例えば、ネットワークリクエストやローカルDBの大量データのクエリ時など<br>
そのため、flowを使用してデータがemitされるのを待つことができます<br>
ここで少し例を挙げます：
<script src="https://gist.github.com/waitzShigoto/15bd34c56591b39a43887e892a0ff1bf.js"></script>

<div class="c-border-content-title-1">画面の応答に必要なデータを保存するためのviewstateを作成する</div>
* 次に、画面上で変化するすべての内容を整理するために<br>
データクラスを作成して、画面に必要なデータを保存します<br>
<script src="https://gist.github.com/waitzShigoto/df6639924388dce2a2def14fe45d39c0.js"></script>

<div class="c-border-content-title-1">combineを使ってflowを組み合わせる</div>
* 次に、`combine`を使用してさまざまなデータソースを組み合わせます<br>
combineはすべてのflowを組み合わせ<br>
最近emitされた値を組み合わせます<br><br>
その実装の原理は、関数型またはラムダ関数を使用することです<br>
指定した型のflowを返します<br>
<img src="/images/compose/006.png" width="100%"><br><br>
* ラムダ`{}`内で判定したい値がある場合も考慮できます<br>
最終的に、前に定義したViewStateを使って結果を返すだけです<br>
`.stateIn`は、このR型flowの初期値を設定できます<br>
<script src="https://gist.github.com/waitzShigoto/93f44fdfaae010f19254a3b0cc5cfc5a.js"></script>

<div class="c-border-content-title-1">実際にcomposeでflowからのデータを使用する</div>
* 前の手順が完了したら、`.collectAsState()`を使用して前のflowを取得し<br>
composeで使用できるstateに収集します<br>
この時点で画面をリアクティブに更新できます~<br>

<script src="https://gist.github.com/waitzShigoto/a86bac16bd42eab68566b6b440fc6e5d.js"></script>
<a class="link" href="#category" data-scroll>目次に戻る</a>
