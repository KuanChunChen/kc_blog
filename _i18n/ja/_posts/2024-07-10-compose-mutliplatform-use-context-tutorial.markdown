---
layout: post
title: "【Compose Multiplatform】KoinでAndroidのContextを扱うクロスプラットフォームアプリの実装"
date: 2024-07-10 16:44:11 +0800
image: cover/compose_multiplatform_di_context.png
tags: [Kotlin, Compose Multiplatform, Dependency Injection, Koin]
permalink: /compose-multiplatform-di-context
categories: ComposeMultiplatform
excerpt: "この記事では、Compose Multiplatformプロジェクトで依存性注入にKoinを使用する際のAndroid固有のContext問題の処理方法について詳しく説明し、実際のコード実装を提供します。"
---

<div class="c-border-main-title-2">はじめに</div>

Compose Multiplatformプロジェクトを開発する際<br>
プラットフォーム固有の問題に対処する必要があります<br>
その中で直面する問題の一つは<br>
AndroidプラットフォームではContextが必要ですが、iOSでは必要ないということです<br>
この記事では、Koinを使用した依存性注入の際に<br>
この問題を正常に解決する方法を紹介します<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>


<div class="c-border-main-title-2">実装方法</div>
<div class="c-border-content-title-1">1. expectとactualキーワードの使用</div>
まず<br>
CMPのexpectとactualキーワードを使用して、異なるプラットフォームに異なる実装を提供する必要があります<br><br>

最初にcommonMainでexpectを作成します<br>
この例では、SettingDataStoreがcontextを必要とし<br>
LearningViewModelがSettingDataStoreを必要とするため<br>
expect platformModule変数を作成しました<br>
<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-content-title-1">2. Androidプラットフォームの実装</div>
Androidプラットフォームでは、platformModuleを実装する必要があります<br>
ここでdataStoreがcontextを取得する必要があると想定しています：<br>
<script src="https://gist.github.com/waitzShigoto/683e5aae4fed38732e316cb0a94cde94.js"></script>

<div class="c-border-content-title-1">3. iOSプラットフォームの実装</div>
iOSプラットフォームでは、Contextは必要ありません<br>
そのため直接実装できます<br>
<script src="https://gist.github.com/waitzShigoto/912bd0f442f650156791481b1cf7e4c3.js"></script>

<div class="c-border-content-title-1">4. Koinの初期化</div>
各プラットフォームのエントリポイントでKoinを初期化します：<br><br>

Android<br>
Androidのエントリポイントでcontextを取得し<br>
startKoinのモジュールリストに挿入します<br>
<script src="https://gist.github.com/waitzShigoto/34ee8c8baf10fe2ab0a34a0d3815994a.js"></script>

iOS:<br>
<script src="https://gist.github.com/waitzShigoto/425c93b104dcc5cc35373a83174dfe1d.js"></script>

<div class="c-border-main-title-2">使用方法</div>
commonMainでkoinViewModelを使用して注入されたViewModel：<br>
<script src="https://gist.github.com/waitzShigoto/0d756e78444510d20f26fec3a8829358.js"></script>

またはモジュールで`get()`を使用して必要なインスタンスを生成することもできます
<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-main-title-2">まとめ</div>
- expectとactualキーワードを使用することでプラットフォームの違いを処理できます
- KoinはCompose Multiplatformで依存性注入のサポートを提供します
- Contextを適切に処理することで、クロスプラットフォームコードがより明確で保守しやすくなります
- この方法は他のプラットフォーム固有の依存性注入シナリオにも適用できます
- 実際の開発では、自分のニーズに応じて柔軟にDI戦略を調整できます 