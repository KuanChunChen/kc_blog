---
layout: post
title: "【Compose Multiplatform】依存性注入Koinの使用方法"
date: 2024-07-10 14:12:20 +0800
image: cover/compose_multiplatform_koin.png
tags: [Kotlin, Compose Multiplatform, Koin, Dependency Injection]
permalink: /compose-multiplatform-koin
categories: ComposeMultiplatform
excerpt: "この記事では、Compose Multiplatformプロジェクトで依存性注入フレームワークKoinを使用する方法について詳しく説明します。ライブラリのインポート、DI実装、および異なるプラットフォームでKoinを初期化する方法を含みます。"
---

<div class="c-border-main-title-2">はじめに</div>

Compose Multiplatformプロジェクトでは<br>
依存性注入は重要な設計パターンです<br>
軽量なDIフレームワークであるKoinは<br>
クロスプラットフォーム開発に非常に適しています<br>
本記事では、Compose Multiplatformで<br>
Koinを使った依存性注入の方法を紹介します<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>


<div class="c-border-main-title-2">実装手順</div>
<div class="c-border-content-title-1">1. ライブラリのインポート</div>
.tomlファイルに追加：<br>
<script src="https://gist.github.com/waitzShigoto/1c76521f84737bfa12984f2ca451d340.js"></script>

build.gradle.ktsに追加：<br>
<script src="https://gist.github.com/waitzShigoto/305692852ee11669c95e6b6d7a4c069d.js"></script>

<div class="c-border-content-title-1">2. DIコンテンツの実装</div>
次に、具体的なDIの内容を実装する必要があります：<br>
実際のニーズに基づいて実装できます<br>
例えば、viewmodel、database、datastoreなどの使用を計画しているかもしれません<br>
実際のニーズに応じて分類し<br>
コードの保守性と管理性を向上させることができます<br>
<script src="https://gist.github.com/waitzShigoto/5b922a7f0eeb3c57e35fdb6d2f2c2842.js"></script>

<div class="c-border-content-title-1">3. Koinの初期化</div>
実装が`クロスプラットフォーム`アクセスを必要とする場合<br>
例えば、AndroidでContextにアクセスする場合<br>
依存性注入は別々に注入する必要があります<br>
異なるプラットフォームと要件に基づいて、Koinを初期化する複数の方法があります：<br>

iOSMainの場合：<br>
<script src="https://gist.github.com/waitzShigoto/9a283e26ab1ba7df68b49e1a5afdd9d7.js"></script>

androidMainの場合：<br>
<script src="https://gist.github.com/waitzShigoto/9aa5cf28e011445cfefb4cf96c37fbd9.js"></script>

実装が`クロスプラットフォーム`アクセスを必要としない場合<br>
以下の方法でcommonMainに直接注入できます<br>
koin-composeバージョン1.2.0では、`KoinApplication`を使用して<br>
コードの一貫性を高めることができます<br>
<script src="https://gist.github.com/waitzShigoto/678e1811c1cb91ea1ede5a3de49587c0.js"></script>

または元の`startKoin`も使用できます：<br>
<script src="https://gist.github.com/waitzShigoto/b027bf199cb30df673fff52f95216aef.js"></script>

<div class="c-border-content-title-1">4. 実際の使用</div>

その後、`koinViewModel`を直接使用してviewmodelを注入できます
<script src="https://gist.github.com/waitzShigoto/e76b173931dad48aa8d87b9853021e5e.js"></script>

または一部のコンポーネントでは、モジュールで`get()`を使用してインスタンスを取得できます

<div class="c-border-main-title-2">まとめ</div>
- KoinはCompose Multiplatformで使用できます
- 適切な設定により、Koinを異なるプラットフォームで柔軟に使用できます
- Koinを使用することで、クロスプラットフォームプロジェクトの依存関係管理が大幅に簡素化されます
- プロジェクトの規模と複雑さに基づいて、適切な初期化方法を選択しましょう 